export async function copyToClipboard(content: string) {
  await navigator.clipboard.writeText(content);
}
