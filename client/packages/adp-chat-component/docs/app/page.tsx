import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">ADP Chat Component</h1>
      <p className="text-lg text-fd-muted-foreground mb-8 max-w-2xl">
        一套完整的 AI 聊天组件库，基于 Vue 3 + TDesign 构建，支持聊天界面、消息发送、会话管理等功能。
      </p>
      <div className="flex gap-4">
        <Link
          href="/docs"
          className="px-6 py-3 bg-fd-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          开始使用
        </Link>
        <Link
          href="/docs/components"
          className="px-6 py-3 border border-fd-border rounded-lg font-medium hover:bg-fd-muted transition-colors"
        >
          组件文档
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="p-6 border border-fd-border rounded-lg text-left">
          <i className="ri-chat-3-line ri-2x text-fd-primary mb-4 block"></i>
          <h3 className="font-semibold mb-2">完整聊天界面</h3>
          <p className="text-sm text-fd-muted-foreground">
            提供完整的聊天布局、消息列表、发送器等组件，开箱即用。
          </p>
        </div>
        <div className="p-6 border border-fd-border rounded-lg text-left">
          <i className="ri-palette-line ri-2x text-fd-primary mb-4 block"></i>
          <h3 className="font-semibold mb-2">主题定制</h3>
          <p className="text-sm text-fd-muted-foreground">
            支持亮色/暗色主题切换，可自定义样式变量。
          </p>
        </div>
        <div className="p-6 border border-fd-border rounded-lg text-left">
          <i className="ri-plug-line ri-2x text-fd-primary mb-4 block"></i>
          <h3 className="font-semibold mb-2">灵活集成</h3>
          <p className="text-sm text-fd-muted-foreground">
            支持 Vue 组件引入和动态挂载两种方式，适配多种场景。
          </p>
        </div>
      </div>
    </main>
  );
}
