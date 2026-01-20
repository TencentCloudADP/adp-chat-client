import React, { useEffect, useRef, useId } from 'react'
import ADPChatComponent from 'adp-chat-component'
import type { ApiConfig, ThemeType, Record } from 'adp-chat-component'
import 'adp-chat-component/dist/es/adp-chat-component.css'

export interface ShareChatProps {
  /** 分享 ID */
  shareId: string
  /** 主题 */
  theme?: ThemeType
  /** API 配置 */
  apiConfig?: ApiConfig
  /** 加载完成回调 */
  onLoadComplete?: (records: Record[]) => void
  /** 加载失败回调 */
  onLoadError?: (error: Error) => void
}

/**
 * ShareChat React 组件
 * 封装 Vue 的 ShareChat 组件
 */
const ShareChat: React.FC<ShareChatProps> = (props) => {
  const uniqueId = useId()
  const containerId = `share-chat-${uniqueId.replace(/:/g, '-')}`
  const containerRef = useRef<HTMLDivElement>(null)
  const mountedIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !props.shareId) return

    // 卸载旧实例
    if (mountedIdRef.current) {
      try {
        ADPChatComponent.ShareChat.unmount(mountedIdRef.current)
      } catch {
        // ignore
      }
    }

    // 挂载新实例
    mountedIdRef.current = ADPChatComponent.ShareChat.mount(`#${containerId}`, {
      shareId: props.shareId,
      theme: props.theme ?? 'light',
      apiConfig: props.apiConfig,
      onLoadComplete: props.onLoadComplete,
      onLoadError: props.onLoadError,
    }) || null

    return () => {
      if (mountedIdRef.current) {
        try {
          ADPChatComponent.ShareChat.unmount(mountedIdRef.current)
        } catch {
          // ignore
        }
        mountedIdRef.current = null
      }
    }
  }, [containerId, props.shareId, props.theme])

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default ShareChat
