import { VapiFile } from '@/types/vapi'

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY!
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!

export async function syncVapiKnowledgeBase(content: string): Promise<string> {
  const filesResponse = await fetch('https://api.vapi.ai/file', {
    headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` },
  })
  const files = (await filesResponse.json()) as VapiFile[]
  const oldFile = files.find((f) => f.name === 'incode-website-sync.txt')
  
  if (oldFile) {
    await fetch(`https://api.vapi.ai/file/${oldFile.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` },
    })
  }

  const formData = new FormData()
  formData.append('file', new Blob([content], { type: 'text/plain' }), 'incode-website-sync.txt')

  const uploadResponse = await fetch('https://api.vapi.ai/file', {
    method: 'POST',
    headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` },
    body: formData,
  })
  const newFile = await uploadResponse.json()

  const assistantResponse = await fetch(
    `https://api.vapi.ai/assistant/${VAPI_ASSISTANT_ID}`,
    { headers: { Authorization: `Bearer ${VAPI_PRIVATE_KEY}` } }
  )
  const assistant = await assistantResponse.json()

  // Update fileIds in knowledgeBase — replace the old ID with a new one
  const currentFileIds: string[] = assistant.model?.knowledgeBase?.fileIds ?? []
  const updatedFileIds = [
    ...currentFileIds.filter((id: string) => id !== oldFile?.id),
    newFile.id,
  ]

  // PATCH assistant with full model object
  const patchResponse = await fetch(
    `https://api.vapi.ai/assistant/${VAPI_ASSISTANT_ID}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: {
          ...assistant.model,
          knowledgeBase: {
            ...assistant.model?.knowledgeBase,
            fileIds: updatedFileIds,
          },
        },
      }),
    }
  )

  if (!patchResponse.ok) {
    const err = await patchResponse.text()
    throw new Error(`Failed to update assistant: ${err}`)
  }

  return newFile.id
}