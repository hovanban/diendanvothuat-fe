"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ImportUsersButton() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      setIsImporting(true);

      const response = await fetch("/api/admin/users/import", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import users");
      }

      // Show success message
      toast({
        title: "Import Completed",
        description: `
          Total: ${data.result.total} users
          Success: ${data.result.success} users imported
          Skipped: ${data.result.skipped} users (already exists)
          Failed: ${data.result.failed} users
        `,
        variant: "default",
      });

      // Show errors if any
      if (data.result.errors.length > 0) {
        console.log("Import errors:", data.result.errors);
      }

      // Reload the page to show new users
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import users",
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
      className="bg-primary text-light-900 hover:bg-primary/90"
    >
      {isImporting ? "Importing..." : "Import Users"}
    </Button>
  );
}
