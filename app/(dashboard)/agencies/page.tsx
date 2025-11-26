"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loadAgenciesCSVData } from "@/lib/data-loader";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const Agencies = () => {
  // Stores agency data
  const [agencies, setAgencies] = useState<Agency[]>([]);

  // Tracks whether data is still being fetched
  const [loading, setLoading] = useState(true);

  // Holds any error message from loading
  const [error, setError] = useState<string | null>(null);

  // Counts how many times reload has been attempted
  const [retryCount, setRetryCount] = useState(0);

  // Loads agencies from CSV and updates state
  const loadAgencies = useCallback(async () => {
    try {
      setLoading(true); // Show loading UI
      setError(null); // Clear previous error

      const agenciesData = await loadAgenciesCSVData();

      // Check if valid array was returned
      if (!Array.isArray(agenciesData)) {
        throw new Error("Invalid data format received");
      }

      // Save loaded data into state
      setAgencies(agenciesData);

      // Show success message only after retry
      if (retryCount > 0) {
        toast.success(
          `Agencies loaded successfully (${agenciesData.length} records)`
        );
      }

      // Reset retry count after success
      setRetryCount(0);
    } catch (err) {
      // If error occurred, determine error message
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load agencies. Please try again.";

      setError(errorMessage);

      // Display error toast notification
      toast.error("Failed to load agencies", {
        description: errorMessage,
      });

      // Log error for debugging
      console.error("Error loading agencies:", err);
    } finally {
      // Stop showing loader once done
      setLoading(false);
    }
  }, [retryCount]);

  // Run once when component loads
  useEffect(() => {
    loadAgencies();
  }, [loadAgencies]);

  // Retry loading when user clicks button
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    loadAgencies();
  };

  // --------- LOADING SCREEN ---------
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton UI shown during loading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
        </div>

        <Card className="bg-transparent border-none">
          <CardContent className="p-0">
            {/* Fake rows for loading effect */}
            <div className="space-y-3">
              <div className="h-10 bg-muted animate-pulse rounded" />
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted/50 animate-pulse rounded"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Animated spinner */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Loading agencies...</span>
          </div>
        </div>
      </div>
    );
  }

  // --------- ERROR SCREEN ---------
  if (error) {
    return (
      <div className="space-y-4">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agencies</h1>
          <p className="text-sm text-muted-foreground mt-1">List of Agencies</p>
        </div>

        {/* Error alert display */}
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium">Failed to load agencies</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
            </div>

            {/* Retry button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="ml-4 shrink-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>

        {/* UI if data cannot be shown */}
        <Card className="bg-transparent border-none">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Unable to display agencies at this time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --------- EMPTY STATE ---------
  if (agencies.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agencies</h1>
          <p className="text-sm text-muted-foreground mt-1">List of Agencies</p>
        </div>

        {/* Reload button when list is empty */}
        <Button variant="outline" size="sm" onClick={handleRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>

        {/* Empty screen design */}
        <Card className="bg-transparent border-none">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-6 w-6" />
              <p className="text-lg font-medium">No agencies found</p>
              <p className="text-sm">
                There are currently no agencies to display
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --------- SUCCESS STATE ---------
  return (
    <div className="space-y-4">
      {/* Page header and agency count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agencies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {agencies.length} {agencies.length === 1 ? "agency" : "agencies"}
          </p>
        </div>

        {/* Reload button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Table of agencies */}
      <Card className="bg-transparent border-none">
        <CardContent className="p-0">
          <DataTable columns={columns} data={agencies} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Agencies;
// Makes this component usable elsewhere
