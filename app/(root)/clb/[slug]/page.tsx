import { clubsApi } from "@/lib/api-client";
import ParseHTML from "@/components/shared/ParseHTML";
import IncrementClubView from "@/components/shared/IncrementClubView";
import StarRating from "@/components/shared/StarRating";
import ClubReviewSection from "@/components/shared/ClubReviewSection";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let club: any;
  try {
    const res = await clubsApi.getBySlug(params.slug) as any;
    club = res?.club || res;
  } catch {
    return { title: "Không tìm thấy câu lạc bộ" };
  }

  if (!club) return { title: "Không tìm thấy câu lạc bộ" };

  const title = `${club.name} - CLB ${club.martialArt?.name || "Võ thuật"} tại ${club.province?.name || ""}`;
  const description = club.description || `Thông tin về ${club.name}`;
  const imageUrl = club.thumbnail || "/assets/images/default-club.png";

  const url = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'}/clb/${club.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: club.name }],
      locale: "vi_VN",
      type: "website",
      siteName: "Diễn Đàn Võ Thuật",
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ClubDetailPage({ params }: Props) {
  let club: any;
  let childClubs: any[] = [];

  try {
    const res = await clubsApi.getBySlug(params.slug) as any;
    club = res?.club || res;
    childClubs = res?.childClubs || [];
  } catch {
    notFound();
  }

  if (!club) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: club.name,
    description: club.description,
    image: club.thumbnail,
    address: {
      "@type": "PostalAddress",
      streetAddress: club.address,
      addressLocality: club.province?.name,
      addressCountry: "VN",
    },
    telephone: club.coaches?.[0]?.phone || "",
    sport: club.martialArt?.name || "Martial Arts",
    ...(club.coaches?.length > 0 && {
      employee: club.coaches.map((coach: any) => ({
        "@type": "Person",
        name: coach.name,
        telephone: coach.phone,
        jobTitle: "Huấn luyện viên",
      })),
    }),
  };

  const ClubInfo = () => (
    <div className="background-light900_dark300 rounded-lg p-6">
      <h2 className="h3-semibold text-dark200_light900 mb-4">Thông tin câu lạc bộ</h2>
      <div className="flex flex-col gap-3">
        {club.activityTime && (
          <div className="flex items-start gap-3">
            <Image src="/assets/icons/clock.svg" alt="time" width={20} height={20} className="invert-colors" />
            <div>
              <p className="small-medium text-dark400_light800">Thời gian sinh hoạt</p>
              <p className="paragraph-semibold text-dark200_light900">{club.activityTime}</p>
            </div>
          </div>
        )}

        {club.tuitionFee && (
          <div className="flex items-start gap-3">
            <Image src="/assets/icons/star.svg" alt="fee" width={20} height={20} className="invert-colors" />
            <div>
              <p className="small-medium text-dark400_light800">Học phí</p>
              <p className="paragraph-semibold text-dark200_light900">{club.tuitionFee}</p>
            </div>
          </div>
        )}

        {club.address && (
          <div className="flex items-start gap-3">
            <Image src="/assets/icons/location.svg" alt="address" width={20} height={20} className="invert-colors" />
            <div>
              <p className="small-medium text-dark400_light800">Địa chỉ</p>
              <p className="paragraph-semibold text-dark200_light900">
                {club.address}{club.province && `, ${club.province.name}`}
              </p>
            </div>
          </div>
        )}

        {club.facebookLink && (
          <div className="flex items-start gap-3">
            <Image src="/assets/icons/link.svg" alt="facebook" width={20} height={20} className="invert-colors" />
            <div>
              <p className="small-medium text-dark400_light800">Facebook</p>
              <Link href={club.facebookLink} target="_blank" className="paragraph-semibold text-primary-500 hover:underline">
                Xem trang Facebook
              </Link>
            </div>
          </div>
        )}

        {club.gmapLink && (
          <div className="flex items-start gap-3">
            <Image src="/assets/icons/location.svg" alt="map" width={20} height={20} className="invert-colors" />
            <div>
              <p className="small-medium text-dark400_light800">Bản đồ</p>
              <Link href={club.gmapLink} target="_blank" className="paragraph-semibold text-primary-500 hover:underline">
                Xem trên Google Maps
              </Link>
            </div>
          </div>
        )}

        {club.coaches && club.coaches.length > 0 && (
          <div className="flex flex-col gap-4 mt-2">
            <p className="base-semibold text-dark200_light900">Đội ngũ huấn luyện viên</p>
            {club.coaches.map((coach: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <Image src="/assets/icons/user.svg" alt="coach" width={20} height={20} className="invert-colors flex-shrink-0 mt-1" />
                <div className="flex flex-row gap-5 flex-wrap">
                  <p className="base-semibold text-dark200_light900">{coach.name}</p>
                  <p className="small-regular text-dark400_light800 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Image src="/assets/icons/suitcase.svg" alt="phone" width={14} height={14} className="invert-colors" />
                      {coach.phone}
                    </span>
                  </p>
                  {coach.description && (
                    <p className="small-regular text-dark400_light800 italic">{coach.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <IncrementClubView clubId={String(club._id)} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex w-full flex-col">
        {/* Header */}
        <div className="flex w-full flex-col gap-4">
          {club.thumbnail && (
            <div className="relative h-[450px] w-full overflow-hidden rounded-lg">
              <Image
                src={club.thumbnail}
                alt={club.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h1 className="h1-bold text-dark100_light900">{club.name}</h1>

            {club.totalReviews > 0 && (
              <div className="mt-2">
                <StarRating
                  rating={club.averageRating}
                  totalReviews={club.totalReviews}
                  size="md"
                  showNumber
                />
              </div>
            )}

            {club.parentClub && (
              <div className="mt-2 flex items-center gap-2 text-dark400_light800">
                <span className="small-regular">Trực thuộc:</span>
                <Link href={`/clb/${club.parentClub.slug}`} className="small-semibold text-primary-500 hover:underline">
                  {club.parentClub.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="paragraph-regular text-dark400_light800">{club.description}</p>
        </div>

        {/* Layout with child clubs sidebar if applicable */}
        {childClubs.length > 0 ? (
          <div className="mt-8 flex flex-col md:flex-row gap-6">
            {/* Child clubs sidebar - 30% */}
            <div className="md:w-[30%]">
              <div className="background-light900_dark300 rounded-lg p-4 sticky top-24">
                <h2 className="h3-semibold text-dark200_light900 mb-4">CLB Thành Viên</h2>
                <div className="flex flex-col gap-3">
                  {childClubs.map((childClub: any) => (
                    <Link
                      key={childClub._id}
                      href={`/clb/${childClub.slug}`}
                      className="background-light800_dark400 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-3">
                        {childClub.thumbnail && (
                          <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg">
                            <Image src={childClub.thumbnail} alt={childClub.name} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="small-semibold text-dark200_light900 mb-1 line-clamp-2">{childClub.name}</h3>
                          <p className="text-xs text-dark400_light800 line-clamp-1">{childClub.province?.name}</p>
                          <p className="paragraph-semibold text-dark200_light900">{childClub.activityTime}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content - 70% */}
            <div className="md:w-[70%] flex flex-col gap-6">
              <ClubInfo />
              <div className="background-light900_dark300 rounded-lg p-6 border border-light-700 dark:border-dark-400">
                <h2 className="h3-semibold text-dark200_light900 mb-4">Chi tiết câu lạc bộ</h2>
                <ParseHTML data={club.content} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <ClubInfo />
            </div>
            <div className="mt-8 background-light900_dark300 rounded-lg p-6 border border-light-700 dark:border-dark-400">
              <h2 className="h3-semibold text-dark200_light900 mb-4">Chi tiết câu lạc bộ</h2>
              <ParseHTML data={club.content} />
            </div>
          </>
        )}

        {/* Reviews Section */}
        <div className="mt-12 pt-8 border-t-2 border-light-700 dark:border-dark-400">
          <ClubReviewSection clubId={String(club._id)} />
        </div>

        {/* Back to list */}
        <div className="mt-8">
          <Link
            href="/clb"
            className="subtle-medium primary-gradient min-h-[46px] px-4 py-3 text-light-900 rounded-lg inline-block"
          >
            ← Quay lại danh sách câu lạc bộ
          </Link>
        </div>
      </div>
    </>
  );
}
