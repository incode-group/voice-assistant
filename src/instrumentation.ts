export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startKnowledgeSyncCron } = await import('@/shared/lib/cron')
    startKnowledgeSyncCron()
    console.log('[Cron] Knowledge sync scheduled')
  }
}