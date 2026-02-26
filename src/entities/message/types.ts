export type Speaker = 'user' | 'assistant'

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

export interface TranscriptMessage {
  id: string
  role: Speaker
  text: string
  timestamp: Date
  isFinal: boolean
  secondsFromStart?: number
}

export interface VapiMessage {
  type: 'transcript' | 'function-call' | 'tool-calls' | 'hang' | 'speech-update' | 'status-update'
  role?: MessageRole
  transcript?: string
  transcriptType?: 'partial' | 'final'
  secondsFromStart?: number
  functionCall?: {
    name: string
    parameters: Record<string, unknown>
  }
  toolCallList?: Array<{
    function: {
      name: string
      arguments: string
    }
  }>
}

export interface VapiToolCallMessage {
  type: "tool-calls";
  toolCallList: Array<{
    id: string;
    function: { name: string; arguments: string };
  }>;
}

export interface VapiFunctionCallMessage {
  type: "function-call";
  functionCall: { name: string; parameters: unknown };
}