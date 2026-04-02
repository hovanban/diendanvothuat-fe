"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ImportClubsButton() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setIsImporting(true);

      const response = await fetch("/api/admin/clubs/import", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import clubs");
      }

      // Show success message
      toast({
        title: "Import Completed",
        description: `
          Total: ${data.result.total} clubs
          ✅ Success: ${data.result.success} imported
          ⏭️ Skipped: ${data.result.skipped} (already exists)
          ❌ Failed: ${data.result.failed}
        `,
        variant: "default",
      });

      // Show errors if any
      if (data.result.errors.length > 0) {
        console.log("Import errors:", data.result.errors);
        toast({
          title: "Some clubs failed to import",
          description: `Check console for details. ${data.result.errors.length} errors found.`,
          variant: "destructive",
        });
      }

      // Reload the page to show new clubs after a short delay
      if (data.result.success > 0) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import clubs",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button
      onClick={handleImport}
      disabled={isImporting}
      className="bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
    >
      {isImporting ? (
        <>
          <span className="mr-2">⏳</span>
          Importing...
        </>
      ) : (
        <>
          <span className="mr-2">📥</span>
          Import Clubs
        </>
      )}
    </Button>
  );
}
