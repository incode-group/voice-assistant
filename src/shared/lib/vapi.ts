import Vapi from '@vapi-ai/web'
import { VAPI_PUBLIC_KEY } from '@/shared/config/constants'

let vapiInstance: Vapi | null = null

export function getVapiClient(): Vapi {
  if (typeof window === 'undefined') {
    throw new Error('Vapi client can only be used in the browser')
  }

  vapiInstance ??= new Vapi(VAPI_PUBLIC_KEY);

  return vapiInstance
}