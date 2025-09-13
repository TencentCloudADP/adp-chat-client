import { MessagePlugin } from 'tdesign-vue-next';
import  { t } from '@/i18n'

/**
 * @description 复制文字内容到剪切板
 */
export const copy = function (text: string) {
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

};