export function downloadFileFromUrl(url: string): void {
    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    anchorElement.download = fileName;
    anchorElement.click();
}