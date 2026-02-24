import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Assistant — Incode Group',
  description: 'Talk to our AI assistant to learn about Incode Group services and schedule a discovery call.',
}

export default function AssistantPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}