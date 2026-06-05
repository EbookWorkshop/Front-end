export async function captureElement(
  element: HTMLElement,
  options = { scale: 2.5 }
): Promise<string> {
  // 动态导入 html2canvas
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: false,
    ...options
  });
  return canvas.toDataURL('image/png');
}