/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.css' {
  const css: string
  export default css
}

declare module '*.ico' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module 'adp-chat-component' {
  import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
  import type { DefineComponent } from 'vue'
  
  export function configureAxios(config: AxiosRequestConfig): void
  export function setResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse['data'] | Promise<AxiosResponse['data']>,
    onRejected?: (error: AxiosError) => Promise<never>
  ): void
  export function setRequestInterceptor(
    onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onRejected?: (error: AxiosError) => Promise<never>
  ): void
  
  export interface Application {
    ApplicationId: string
    Avatar?: string
    Name?: string
    Greeting?: string
    OpeningQuestions?: string[]
    [key: string]: unknown
  }

  export interface ChatConversation {
    Id: string
    AccountId: string
    Title: string
    LastActiveAt: number
    CreatedAt: number
    ApplicationId: string
    [key: string]: unknown
  }

  export interface ChatConversationProps {
    ShareId?: string
    ConversationId?: string
    ApplicationId?: string
    [key: string]: unknown
  }

  export interface Record {
    RecordId: string
    Role: 'user' | 'assistant' | 'system'
    Content: string
    [key: string]: unknown
  }

  export interface ApiConfig {
    applicationListApi?: string
    conversationListApi?: string
    conversationDetailApi?: string
    sendMessageApi?: string
    rateApi?: string
    shareApi?: string
    userInfoApi?: string
    uploadApi?: string
    asrUrlApi?: string
    [key: string]: string | undefined
  }

  // 组件导出
  export const ChatLayout: DefineComponent<object, object, unknown>
  export const ChatItem: DefineComponent<object, object, unknown>
  export const Chat: DefineComponent<object, object, unknown>
  export const ChatSender: DefineComponent<object, object, unknown>
  export const MainLayout: DefineComponent<object, object, unknown>
  export const SideLayout: DefineComponent<object, object, unknown>
  export const ApplicationList: DefineComponent<object, object, unknown>
  export const HistoryList: DefineComponent<object, object, unknown>
  
  // Service 导出
  export const httpService: {
    get: <T = unknown>(url: string, params?: object) => Promise<T>
    post: <T = unknown>(url: string, data?: object) => Promise<T>
    put: <T = unknown>(url: string, data?: object) => Promise<T>
    delete: <T = unknown>(url: string, params?: object) => Promise<T>
  }
  export const fetchApplicationList: (params?: object) => Promise<{ Data: Application[] }>
  export const fetchConversationList: (params?: object) => Promise<{ Data: { Conversations: ChatConversation[] } }>
  export const fetchConversationDetail: (params?: object) => Promise<unknown>
  export const sendMessage: (params?: object) => Promise<unknown>
  export const rateMessage: (params?: object) => Promise<unknown>
  export const createShare: (params?: object) => Promise<unknown>
  export const fetchUserInfo: (params?: object) => Promise<unknown>
  export const uploadFile: (params?: object) => Promise<unknown>
  export const defaultApiConfig: ApiConfig
  
  const AdpChatComponent: DefineComponent<object, object, unknown>
  export default AdpChatComponent
}
