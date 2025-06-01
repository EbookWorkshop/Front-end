import html2canvas from 'html2canvas';

export async function captureElement(
  element: HTMLElement,
  options = { scale: 2.5 }
): Promise<string> {
  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: false,
    ...options
  });
  return canvas.toDataURL('image/png');
}
