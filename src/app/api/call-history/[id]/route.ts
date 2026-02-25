import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const res = await fetch(`https://api.vapi.ai/call/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Call not found' }, { status: 404 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}