"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface AffiliateChartProps {
  data: Array<{
    _id: string;
    clicks: number;
    conversions: number;
  }>;
  chartPeriod?: {
    startDate: string;
    endDate: string;
    month?: number;
    year?: number;
  };
  basePath?: string;
}

export default function AffiliateChart({
  data,
  chartPeriod,
  basePath = "/admin/affiliates",
}: AffiliateChartProps) {
  const router = useRouter();

  const currentDate = new Date();
  const currentMonth = chartPeriod?.month || currentDate.getMonth() + 1;
  const currentYear = chartPeriod?.year || currentDate.getFullYear();

  // Select value should be empty string when no specific month is selected (30 days mode)
  const selectValue = chartPeriod?.month !== undefined
    ? `${currentMonth}-${currentYear}`
    : "";

  const handleMonthChange = (month: number, year: number) => {
    router.push(`${basePath}?month=${month}&year=${year}`);
  };

  // Generate month options (last 12 months)
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    monthOptions.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, "MMMM yyyy", { locale: vi }),
    });
  }

  const maxClicks = Math.max(...data.map((d) => d.clicks), 1);
  const maxConversions = Math.max(...data.map((d) => d.conversions), 1);

  // Check for empty state
  const hasData = data.length > 0 && data.some(d => d.clicks > 0 || d.conversions > 0);

  return (
    <div className="background-light900_dark200 rounded-xl p-6 border light-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-dark100_light900 mb-1">
            📈 Thống kê chi tiết
          </h3>
          <p className="text-sm text-dark400_light700">
            Clicks và conversions theo ngày (toàn hệ thống)
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectValue}
            onChange={(e) => {
              if (e.target.value === "") {
                // Navigate to default 30 days view
                router.push(basePath);
              } else {
                const [month, year] = e.target.value.split("-").map(Number);
                handleMonthChange(month, year);
              }
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border light-border background-light800_dark300 text-dark100_light900 font-medium cursor-pointer hover:background-light700_dark400 transition-colors"
          >
            <option value="">30 ngày qua</option>
            {monthOptions.map((option) => (
              <option
                key={`${option.month}-${option.year}`}
                value={`${option.month}-${option.year}`}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {!hasData && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-dark400_light700 text-lg mb-2">
            Chưa có dữ liệu cho khoảng thời gian này
          </p>
          <p className="text-dark500_light500 text-sm">
            Thống kê sẽ xuất hiện khi có affiliate clicks
          </p>
        </div>
      )}

      {/* Chart */}
      {hasData && (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Legend */}
          <div className="flex items-center justify-end gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-dark400_light700">Clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-dark400_light700">Conversions</span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative h-64 background-light800_dark300 rounded-lg p-4">
            <div className="flex items-end justify-between h-full gap-1">
              {data.map((day, index) => {
                const clickHeight = (day.clicks / maxClicks) * 100;
                const conversionHeight = (day.conversions / maxConversions) * 100;
                const date = new Date(day._id);
                const dayOfMonth = date.getDate();

                return (
                  <div
                    key={day._id}
                    className="flex-1 flex flex-col items-center gap-1 min-w-[20px] group relative"
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                      <div className="background-light900_dark200 border light-border rounded-lg p-3 shadow-lg min-w-[150px]">
                        <p className="text-xs font-semibold text-dark100_light900 mb-1">
                          {format(date, "dd/MM/yyyy", { locale: vi })}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-dark400_light700">
                              Clicks:
                            </span>
                            <span className="text-xs font-semibold text-blue-600">
                              {day.clicks}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-dark400_light700">
                              Conversions:
                            </span>
                            <span className="text-xs font-semibold text-green-600">
                              {day.conversions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="w-full flex flex-col items-center justify-end h-full gap-0.5">
                      {/* Clicks Bar */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                        style={{
                          height: `${clickHeight}%`,
                          minHeight: day.clicks > 0 ? "4px" : "0",
                        }}
                      ></div>
                      {/* Conversions Bar */}
                      {day.conversions > 0 && (
                        <div
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all cursor-pointer"
                          style={{
                            height: `${conversionHeight}%`,
                            minHeight: "4px",
                          }}
                        ></div>
                      )}
                    </div>

                    {/* Date Label */}
                    {(index % Math.ceil(data.length / 10) === 0 ||
                      dayOfMonth === 1) && (
                      <span className="text-[10px] text-dark500_light500 mt-1">
                        {dayOfMonth === 1
                          ? format(date, "dd/MM", { locale: vi })
                          : dayOfMonth.toString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="background-light800_dark300 rounded-lg p-3 text-center">
              <p className="text-xs text-dark400_light700 mb-1">Tổng Clicks</p>
              <p className="text-lg font-bold text-blue-600">
                {data.reduce((sum, day) => sum + day.clicks, 0).toLocaleString()}
              </p>
            </div>
            <div className="background-light800_dark300 rounded-lg p-3 text-center">
              <p className="text-xs text-dark400_light700 mb-1">
                Tổng Conversions
              </p>
              <p className="text-lg font-bold text-green-600">
                {data
                  .reduce((sum, day) => sum + day.conversions, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="background-light800_dark300 rounded-lg p-3 text-center">
              <p className="text-xs text-dark400_light700 mb-1">
                Clicks TB/ngày
              </p>
              <p className="text-lg font-bold text-dark100_light900">
                {(data.reduce((sum, day) => sum + day.clicks, 0) / data.length).toFixed(1)}
              </p>
            </div>
            <div className="background-light800_dark300 rounded-lg p-3 text-center">
              <p className="text-xs text-dark400_light700 mb-1">
                Conv TB/ngày
              </p>
              <p className="text-lg font-bold text-dark100_light900">
                {(
                  data.reduce((sum, day) => sum + day.conversions, 0) /
                  data.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
