import type { VapiCallDetail } from '@/types/vapi'

export async function generateCallTitle(
  messages: Array<{ role: string; text: string }>
): Promise<string> {
  const res = await fetch('/api/generate-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  
  if (!res.ok) return 'Voice conversation'
  const data = await res.json()
  return data.title
}

export async function fetchCallTranscript(callId: string, retries = 3): Promise<VapiCallDetail> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(`/api/call-history/${callId}`)
    
    if (res.ok) {
      const data = await res.json()
      if (data?.messages?.length > 0) return data
    }
    
    if (i < retries - 1) {
      await new Promise(r => setTimeout(r, 3000 * (i + 1)))
    }
  }
  
  throw new Error('Failed to fetch call')
}