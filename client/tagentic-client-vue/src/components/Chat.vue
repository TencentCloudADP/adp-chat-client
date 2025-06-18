<script setup lang="ts">
import { theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { computed } from 'vue';
import HelloWorld from './HelloWorld.vue'

defineOptions({ name: 'AXConversationsBasic' });

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const { token } = theme.useToken();

// Customize the style of the container
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));

</script>

<template>
  <a-layout-sider width="256" style="background: #fff">
    <Conversations
        :items="items"
        default-active-key="item1"
        :style="style"
    />
  </a-layout-sider>
  <a-layout style="padding: 10px">
    <a-layout-content
      :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
      <HelloWorld />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
