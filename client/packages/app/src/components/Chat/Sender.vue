<script setup lang="ts">
import { ChatSender as TChatSender } from '@tdesign-vue-next/chat'

defineProps<{
    inputValue: string;
    modelOptions: any[];
    selectModel: any;
    isDeepThinking: boolean;
    isStreamLoad: boolean;
    handleInput: (input: string) => void;
    onStop: () => void;
    inputEnter: () => void;
    handleModelChange: (option: any) => void;
    toggleDeepThinking: () => void;
}>();

</script>

<template>
    <TChatSender :value="inputValue" :loading="isStreamLoad" :textarea-props="{
        placeholder: $t('conversation.input.placeholder'),
        autosize: { minRows: 2, maxRows: 2 },
    }" @stop="onStop" @send="inputEnter" @change="handleInput">
        <!-- 输入区前缀：模型选择与深度思考按钮 -->
        <!-- <template #prefix>
            <div class="select-area">
                <t-dropdown :options="modelOptions" placement="top" maxColumnWidth="2000" @click="handleModelChange">
                    <t-button theme="default" variant="base" shape="round">
                        {{ selectModel.content }}
                        <template #suffix><t-icon name="chevron-down"></t-icon></template>
</t-button>
</t-dropdown>
<t-button :theme="isDeepThinking ? 'primary' : 'default'" shape="round" :variant="isDeepThinking ? 'base' : 'outline'"
    @click="toggleDeepThinking">
    <template #icon><t-icon name="system-sum"></t-icon></template>
    {{ $t('conversation.input.deepThinking') }}
</t-button>
</div>
</template> -->
    </TChatSender>
</template>

<style scoped>
.select-area {
    display: flex;
    align-items: center;
    gap: var(--td-comp-paddingLR-s);
}
</style>
