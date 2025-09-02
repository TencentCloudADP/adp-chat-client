<script setup lang="tsx">
import { useI18n } from 'vue-i18n';
import type { Record } from '@/model/chat'
import { formatDisplayTime } from '@/utils/date'
import {
    ChatAction as TChatAction,
    ChatContent as TChatContent,
    ChatItem as TChatItem,
    ChatLoading as TChatLoading,
} from '@tdesign-vue-next/chat'

const { t } = useI18n();

defineProps<{
    item: Record;
    index: number;
    isLastMsg?:boolean;
    loading: boolean;
    isStreamLoad: boolean;
}>();

/**
 * 渲染推理模块的头部自定义内容
 * @param {boolean} flag - 思维链内容是否加载中
 * @param {object} item - 当前消息项
 * @returns {JSX.Element} 返回对应的头部组件
 */
const renderHeader = (flag: boolean, item: Record) => {
    if (flag) {
        return <TChatLoading text={t('思考中') + '...'} />
    }
    const endText = t('已深度思考')
    //  TODO: 深度思考时间需要显示
    // const endText = item.duration ? `${t('已深度思考')}(${t('用时')} ${item.duration}${t('秒')})` : t('已深度思考')
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
    <TChatItem animation="moving" :name="item.FromName" :role="item.IsLlmGenerated ? 'assistant' : 'user'"
        :variant="item.IsLlmGenerated ? undefined : 'base' " :text-loading="isLastMsg && loading"
        :content="item.Content" :reasoning="{
            collapsed: isLastMsg && !isStreamLoad,
            expandIconPlacement: 'right',
            collapsePanelProps: {
                header: renderHeader(index === 0 && isStreamLoad && !item.Content, item),
                // TODO: 思考过程没有联调
                content: renderReasoningContent(item.Reasons?.join() ?? ''),
            },
        }">
        <template  #datetime>
            <span v-if="item.Timestamp">{{ formatDisplayTime(item.Timestamp * 1000) }}</span>
        </template>
        <template #avatar>
            <t-avatar  :image="item.FromAvatar" size="medium" />
        </template>
        <template #actions v-if="!isStreamLoad || !isLastMsg">
            <TChatAction :operation-btn="['good', 'bad', 'replay', 'copy']" />
        </template>
    </TChatItem>
</template>

<style scoped></style>
