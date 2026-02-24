import cron from "node-cron";

let isScheduled = false;

export function startKnowledgeSyncCron(): void {
  if (isScheduled || typeof window !== "undefined") return;
  isScheduled = true;

  // Every Sunday at 02:00 AM
  cron.schedule("0 2 * * 0", async () => {
    console.log("[Cron] Running weekly knowledge base sync...");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sync-knowledge`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SYNC_SECRET}`,
          },
        },
      );

      const result = await response.json();
      console.log("[Cron] Sync result:", result);
    } catch (error) {
      console.error("[Cron] Sync failed:", error);
    }
  });
}
