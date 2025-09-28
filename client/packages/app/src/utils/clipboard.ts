import { MessagePlugin } from 'tdesign-vue-next';
import  { t } from '@/i18n'
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();
const { isMobile } = storeToRefs(uiStore);

/**
 * 复制文字内容到剪切板
 * @description 支持现代Clipboard API和降级方案，自动处理移动端和桌面端的文本格式
 * @param {string} rowText - 原始文本内容（用于移动端）
 * @param {string} mdText - Markdown格式文本（用于桌面端）
 * @returns {void}
 * @example
 * // 复制纯文本到剪贴板
 * copy('Hello World', '**Hello World**')
 * 
 * // 在移动端会复制"Hello World"，在桌面端会复制"**Hello World**"
 * copy('原始文本', 'Markdown格式文本')
 */
export const copy = function (rowText?: string ,mdText?:string ) {
  let text ;
  if(isMobile){
    if(rowText){
      text = rowText?.replace(/\n{3,}/g, '\n\n');
    }else{
      text = mdText
    }
  }else{
    text = mdText
  }
  if(!text) return;
  
  /**
   * 降级复制方案：使用textarea元素实现复制功能
   * @param {string} text - 要复制的文本内容
   * @returns {void}
   */
  const fallbackCopyToClipboard = (text: string) => {
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    // 赋值
    textarea.value = text;
    // 选中
    textarea.select();

    try {
      // 执行复制命令
      const successful = document.execCommand('copy');
      if (successful) {
        MessagePlugin.success({
          content: t('operation.copySuccess'),
          duration: 3000
        })
      } else {
        MessagePlugin.success({
          content: t('operation.copyError'),
          duration: 3000
        })
        console.error('降级方案复制失败');
      }
    } catch (err) {
      MessagePlugin.success({
          content: t('operation.copyError'),
          duration: 3000
        })
      console.error('降级方案复制出错:', err);
    } finally {
      // 清理：移除临时元素
      document.body.removeChild(textarea);
    }
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(res => {
         MessagePlugin.success({
          content: t('operation.copySuccess'),
          duration: 3000
        })
      })
        .catch(err => {
          console.error('现代API复制失败，使用降级方案:', err);
          fallbackCopyToClipboard(text); // 降级方案
        });
    } else {
      fallbackCopyToClipboard(text); // 降级方案
    }
  } catch (err) {
    console.error('复制失败:', err);
  }
}