/**
 * 文件类型分类
 */
export type FileCategory = 'image' | 'document';

/**
 * 文件上传状态
 */
export type FileUploadStatus = 'uploading' | 'done' | 'error';

/**
 * 上传文件属性
 */
export interface FileProps {
  uid: string;
  url: string;
  name?: string;
  size?: number;
  type?: string;
  status?: FileUploadStatus | string;
  progress?: number;
  category?: FileCategory;
  response?: string;
  /** 文档解析后获取的 doc_id，standard 模式下用于文件对话 */
  docId?: string;
}

/**
 * 根据 MIME 类型判断文件分类
 */
export function getFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  return 'document';
}

/**
 * 支持的图片 MIME 类型
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/bmp',
  'image/webp',
];

/**
 * 支持的文档 MIME 类型
 */
export const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
];

/**
 * 所有支持的文件类型
 */
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

/**
 * 文件大小限制（字节）
 */
export const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024,
  document: 15 * 1024 * 1024,
};

/**
 * 文件上传数量限制
 */
export const FILE_COUNT_LIMIT = 20;

/**
 * 文件扩展名到图标映射
 */
export function getFileIconName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, string> = {
    pdf: 'file_icon_pdf_light',
    doc: 'file_icon_word_light',
    docx: 'file_icon_word_light',
    ppt: 'file_icon_ppt_light',
    pptx: 'file_icon_ppt_light',
    xls: 'file_icon_excel_light',
    xlsx: 'file_icon_excel_light',
    txt: 'file_icon_text_light',
    md: 'file_icon_text_light',
    csv: 'file_icon_excel_light',
    json: 'file_icon_text_light',
  };
  return iconMap[ext] || 'basic_file_line';
}

/**
 * 格式化文件大小为可读字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}