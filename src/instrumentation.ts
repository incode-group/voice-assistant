export async function register() {
  console.log(`[Instrumentation] register() called — runtime: ${process.env.NEXT_RUNTIME}`);

  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[Instrumentation] Starting cron on nodejs runtime...");
    const { startKnowledgeSyncCron } = await import("@/shared/lib/cron");
    startKnowledgeSyncCron();
  }
}