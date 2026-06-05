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
 * 文件扩展名到图标映射（与 gpt-demo FILE_TYPE_ICON_MAP 保持一致）
 */
const FILE_TYPE_ICON_MAP: Record<string, string> = {
    doc: 'file_icon_word_light',
    docx: 'file_icon_word_light',
    md: 'file_icon_markdown_light',
    csv: 'file_icon_excel_light',
    txt: 'file_icon_text_light',
    xls: 'file_icon_excel_light',
    xlsx: 'file_icon_excel_light',
    ppt: 'file_icon_ppt_light',
    pptx: 'file_icon_ppt_light',
    wps: 'file_icon_ppt_light',
    ppsx: 'file_icon_ppt_light',
    pdf: 'file_icon_pdf_light',
    png: 'file_icon_picture_light',
    jpg: 'file_icon_picture_light',
    jpeg: 'file_icon_picture_light',
    tiff: 'file_icon_picture_light',
    bmp: 'file_icon_picture_light',
    gif: 'file_icon_picture_light',
    webp: 'file_icon_picture_light',
    heif: 'file_icon_picture_light',
    heic: 'file_icon_picture_light',
    jp2: 'file_icon_picture_light',
    eps: 'file_icon_picture_light',
    icons: 'file_icon_picture_light',
    im: 'file_icon_picture_light',
    pcx: 'file_icon_picture_light',
    ppm: 'file_icon_picture_light',
    xbm: 'file_icon_picture_light',
    html: 'file_icon_web_light',
    htm: 'file_icon_web_light',
    json: 'file_icon_code_light',
    py: 'file_icon_code_light',
    js: 'file_icon_code_light',
    ts: 'file_icon_code_light',
    jsx: 'file_icon_code_light',
    tsx: 'file_icon_code_light',
    vue: 'file_icon_code_light',
    java: 'file_icon_code_light',
    go: 'file_icon_code_light',
    c: 'file_icon_code_light',
    cpp: 'file_icon_code_light',
    h: 'file_icon_code_light',
    hpp: 'file_icon_code_light',
    cs: 'file_icon_code_light',
    rb: 'file_icon_code_light',
    php: 'file_icon_code_light',
    swift: 'file_icon_code_light',
    kt: 'file_icon_code_light',
    rs: 'file_icon_code_light',
    scala: 'file_icon_code_light',
    sh: 'file_icon_code_light',
    bash: 'file_icon_code_light',
    sql: 'file_icon_code_light',
    yaml: 'file_icon_code_light',
    yml: 'file_icon_code_light',
    xml: 'file_icon_code_light',
    css: 'file_icon_code_light',
    less: 'file_icon_code_light',
    scss: 'file_icon_code_light',
    sass: 'file_icon_code_light',
    lua: 'file_icon_code_light',
    r: 'file_icon_code_light',
    dart: 'file_icon_code_light',
    toml: 'file_icon_code_light',
    ini: 'file_icon_code_light',
    conf: 'file_icon_code_light',
    folder: 'file_icon_file_light',
    mp3: 'file_icon_audio_light',
    wav: 'file_icon_audio_light',
    mp4: 'file_icon_video_light',
    avi: 'file_icon_video_light',
    mov: 'file_icon_video_light',
    wmv: 'file_icon_video_light',
    flv: 'file_icon_video_light',
    mkv: 'file_icon_video_light',
    rm: 'file_icon_video_light',
    rmvb: 'file_icon_video_light',
    mpeg: 'file_icon_video_light',
    webm: 'file_icon_video_light',
    notion: 'file_icon_notion_light',
};

/**
 * 根据文件名获取文件类型图标
 */
export function getFileIconName(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return FILE_TYPE_ICON_MAP[ext] || 'file_icon_other_file_light';
}

/**
 * 格式化文件大小为可读字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}