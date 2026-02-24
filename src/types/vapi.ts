import { VapiMessage } from '@/entities/message'

export interface VapiToolCall {
  id: string
  function: {
    name: string
    arguments: string | Record<string, unknown>
  }
}

export interface VapiPayload {
  message: VapiMessage & {
    toolCallList?: VapiToolCall[]
  }
}

export interface VapiFile {
  id: string
  name: string
}
