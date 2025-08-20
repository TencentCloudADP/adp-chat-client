export interface ChatItem {
  avatar: string
  name: string
  datetime: string
  reasoning?: string // 推理内容，可选
  content: string
  role: 'user' | 'assistant' | 'error' | 'model-change' | 'system' | undefined
  duration?: number // 推理内容持续时间，可选
}

export const mockChatList = [
  { id: '1', title: '随便问问' },
  { id: '2', title: '与TDesign Helper的对话' },
  { id: '3', title: '与天气小助手的对话' },
]

export const chatMockData: Record<string, ChatItem[]> = {
  '1': [
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: '随便问',
      datetime: '2025-07-24T16:48:00',
      reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。也就是说，保持原来的运动状态。

`,
      content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。以下是关键点：
### **1. 牛顿第一定律的核心**
`,
      role: 'assistant',
      duration: 10,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '2025-07-24T16:47:00',
      content: 'ATM在南极怎么维护？',
      role: 'user',
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: '随便问',
      datetime: '2025-07-24T16:41:00',
      reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。也就是说，保持原来的运动状态。

`,
      content: `
# This is TDesign

The point of reference-style links is not that they’re easier to write. The point is that with reference-style links, your document source is vastly more readable. Compare the above examples: using reference-style links, the paragraph itself is only 81 characters long; with inline-style links, it’s 176 characters; and as raw \`HTML\`, it’s 234 characters. In the raw \`HTML\`, there’s more markup than there is text.



> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet.



an example | *an example* | **an example**



1. Bird
1. McHale
1. Parish
    1. Bird
    1. McHale
        1. Parish


    - Red
    - Green
        - Blue



This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>


\`\`\`bash
$ npm i tdesign-vue-next
\`\`\`


\`\`\`javascript
import { createApp } from 'vue';
import App from './app.vue';

const app = createApp(App);
app.use(TDesignChat);
\`\`\`
`,
      role: 'assistant',
      duration: 10,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '2025-07-24T16:40:00',
      content: 'ATM在南极怎么维护？',
      role: 'user',
    },
  ],
  '2': [
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: 'TDesignAI',
      datetime: '2025-07-25T09:04:00',
      reasoning: '重置按钮可以将计数器归零。',
      content:
        '当然可以，您只需添加一个重置按钮并绑定事件：\n\n<template>\n  <button @click="count--">-</button>\n  <span>{{ count }}</span>\n  <button @click="count++">+</button>\n  <button @click="count = 0">重置</button>\n</template>\n\n<script setup>\nimport { ref } from "vue";\nconst count = ref(0);\n</script>',
      role: 'assistant',
      duration: 6,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '2025-07-25T09:03:00',
      content: '谢谢！能加个重置按钮吗？',
      role: 'user',
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: 'TDesignAI',
      datetime: '2025-07-25T09:02:00',
      reasoning: '计数器组件通常包含一个数字和两个按钮。',
      content:
        '当然可以，以下是一个简单的Vue3计数器组件代码：\n\n<template>\n  <button @click="count--">-</button>\n  <span>{{ count }}</span>\n  <button @click="count++">+</button>\n</template>\n\n<script setup>\nimport { ref } from "vue";\nconst count = ref(0);\n</script>',
      role: 'assistant',
      duration: 8,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '2025-07-25T09:01:00',
      content: '你能帮我写一个Vue3的计数器吗？',
      role: 'user',
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: 'TDesignAI',
      datetime: '2025-07-25T09:00:00',
      reasoning: '你好，我是TDesignAI，有什么可以帮您？',
      content: '欢迎使用TDesign Chat，您可以随时提问。',
      role: 'assistant',
      duration: 5,
    },
  ],
  '3': [
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: '天气小助手',
      datetime: '2025-07-26T14:24:00',
      reasoning: '正在查询明天的天气预报。',
      content: '预计明天上海有阵雨，气温27~32℃，请注意防雨。',
      role: 'assistant',
      duration: 2,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '2025-07-26T14:23:00',
      content: '明天有雨吗？',
      role: 'user',
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: '天气小助手',
      datetime: '2025-07-26T14:22:00',
      reasoning: '正在为您查询上海的天气。',
      content: '上海今日多云，气温28~34℃，空气质量良好。',
      role: 'assistant',
      duration: 3,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '2025-07-26T14:21:00',
      content: '上海的天气怎么样？',
      role: 'user',
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: '天气小助手',
      datetime: '2025-07-26T14:20:00',
      reasoning: '天气查询功能可以通过API实现。',
      content: '请问您想查询哪个城市的天气？',
      role: 'assistant',
      duration: 4,
    },
  ],
}

export const mockSSEResponseData = {
  reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。也就是说，保持原来的运动状态。

`,
  content: `
# This is TDesign

The point of reference-style links is not that they’re easier to write. The point is that with reference-style links, your document source is vastly more readable. Compare the above examples: using reference-style links, the paragraph itself is only 81 characters long; with inline-style links, it’s 176 characters; and as raw \`HTML\`, it’s 234 characters. In the raw \`HTML\`, there’s more markup than there is text.



> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet.



an example | *an example* | **an example**



1. Bird
1. McHale
1. Parish
    1. Bird
    1. McHale
        1. Parish


- Red
- Green
- Blue
    - Red
    - Green
        - Blue



This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>


\`\`\`bash
$ npm i tdesign-vue-next
\`\`\`

---

\`\`\`javascript
import { createApp } from 'vue';
import App from './app.vue';

const app = createApp(App);
app.use(TDesignChat);
\`\`\`
`,
}
