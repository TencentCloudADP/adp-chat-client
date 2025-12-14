export interface FileProps {
  uid: string,
  url: string,
  name?: string,
  status?: string,
  response?: string,
  progress?: number,
  size?: number, // 文件大小（字节）
}