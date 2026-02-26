import cron from "node-cron";

let isScheduled = false;

export function startKnowledgeSyncCron(): void {
  if (typeof window !== "undefined") {
    console.warn("[Cron] Skipped — running in browser context");
    return;
  }

  if (isScheduled) {
    console.log("[Cron] Already scheduled, skipping");
    return;
  }

  isScheduled = true;

  // Every Sunday at 02:00 AM (weekly)
  const task = cron.schedule("0 2 * * 0", async () => {
    console.log("[Cron] Running weekly knowledge base sync...");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const syncSecret = process.env.SYNC_SECRET;

    if (!appUrl || !syncSecret) {
      console.error("[Cron] Missing env vars: NEXT_PUBLIC_APP_URL or SYNC_SECRET");
      return;
    }

    try {
      const response = await fetch(`${appUrl}/api/sync-knowledge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${syncSecret}`,
        },
      });

      const result = await response.json();
    } catch (error) {
      console.error("[Cron] Sync failed:", error);
    }
  });

  // Verify cron expression is valid
  if (!task) {
    console.error("[Cron] Failed to schedule — invalid cron expression");
    isScheduled = false;
    return;
  }

  console.log("[Cron] ✓ Knowledge sync scheduled — runs every Sunday at 02:00 AM");
}
