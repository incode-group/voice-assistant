import { VapiMessage } from '@/entities/message'

export interface VapiToolCall {
  id: string
  function: {
    name: string
    arguments: string | Record<string, unknown>
  }
}

export interface VapiToolCallMessage {
  type: 'tool-calls'
  toolCallList: VapiToolCall[]
}

export interface VapiFunctionCallMessage {
  type: 'function-call'
  functionCall: {
    name: string
    parameters: unknown
  }
}

export interface VapiPayload {
  message: VapiMessage & {
    toolCallList?: VapiToolCall[]
    functionCall?: {
      name: string
      parameters: unknown
    }
  }
}

export type AnyVapiMessage =
  | VapiMessage
  | VapiToolCallMessage
  | VapiFunctionCallMessage;

export interface VapiCallMessage {
  role: 'user' | 'assistant' | 'bot' | 'system' | 'tool_call_result' | 'tool_call_invocation' | string;
  message?: string;
  content?: string;
  transcript?: string;
  secondsFromStart?: number;
}

export interface VapiCallDetail {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  type: 'webCall' | 'phoneCall';
  status: 'queued' | 'started' | 'ended';
  messages: VapiCallMessage[];
}

export interface VapiFile {
  id: string;
  name: string;
}

