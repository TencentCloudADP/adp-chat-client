<script setup lang="tsx">
import { useI18n } from 'vue-i18n';
import type { ChatItem as ChatItemModel } from '@/model/chat'
import { formatDisplayTime } from '@/utils/date'
import { useUserStore } from '@/stores/user'
import {
    ChatAction as TChatAction,
    ChatContent as TChatContent,
    ChatItem as TChatItem,
    ChatLoading as TChatLoading,
} from '@tdesign-vue-next/chat'

const { t } = useI18n();
const userStore = useUserStore()


defineProps<{
    item: ChatItemModel;
    index: number;
    loading: boolean;
    isStreamLoad: boolean;
}>();

/**
 * 渲染推理模块的头部自定义内容
 * @param {boolean} flag - 思维链内容是否加载中
 * @param {object} item - 当前消息项
 * @returns {JSX.Element} 返回对应的头部组件
 */
const renderHeader = (flag: boolean, item: ChatItemModel) => {
    if (flag) {
        return <TChatLoading text={t('思考中') + '...'} />
    }
    const endText = item.duration ? `${t('已深度思考')}(${t('用时')} ${item.duration}${t('秒')})` : t('已深度思考')
    return (
        <div style="display:flex;align-items:center" >
            <t-icon
                name="check-circle"
                style={{
                    color: 'var(--td-success-color-5)',
                    fontSize: '20px',
                    marginRight: '8px',
                }
                }
            />
            < span > {endText} </span>
        </div>
    )
}

// 渲染推理内容
const renderReasoningContent = (reasoningContent: string) => (
    <TChatContent content={reasoningContent} role="assistant" />
)

</script>

<template>
    <TChatItem :name="item.role === 'user' ? userStore.name : item.name" :role="item.role"
        :variant="item.role === 'user' ? 'base' : undefined" :text-loading="index === 0 && loading"
        :content="item.content" :reasoning="{
            collapsed: index === 0 && !isStreamLoad,
            expandIconPlacement: 'right',
            collapsePanelProps: {
                header: renderHeader(index === 0 && isStreamLoad && !item.content, item),
                content: renderReasoningContent(item.reasoning ?? ''),
            },
        }">
        <template #datetime>{{ formatDisplayTime(item.datetime) }}</template>
        <template #avatar>
            <t-avatar v-if="item.role === 'user'" size="medium"> {{ userStore.avatarName }} </t-avatar>
            <t-avatar v-else :image="item.avatar" size="medium" />
        </template>
        <template #actions v-if="!isStreamLoad || index !== 0">
            <TChatAction :operation-btn="['good', 'bad', 'replay', 'copy']" />
        </template>
    </TChatItem>
</template>

<style scoped></style>
