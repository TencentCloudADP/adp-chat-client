export function base64ToFile(base64Data:string, filename = 'image.png') {
  // 1. 提取 MIME 类型和纯 Base64 数据
  const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('无效的 Base64 图片格式');
  }
  
  const mimeType = matches[1];
  const base64String = matches[2];
  
  // 2. 将 Base64 字符串转换为字节数组
  const byteCharacters = atob(base64String);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  // 3. 创建 Blob 对象
  const blob = new Blob(byteArrays, { type: mimeType });
  
  // 4. 创建 File 对象
  return new File([blob], filename, {
    type: mimeType,
    lastModified: Date.now()
  });
}