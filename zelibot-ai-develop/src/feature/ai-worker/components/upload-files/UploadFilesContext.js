import { createContext } from 'react';

/**
 * @ignore - internal component.
 * @type {React.Context<{} | {files: Array, completedFiles: Array, onRemoveFile: () => void, onRemoveAllFiles: () => void, onUploadFiles: () => void, response: string}>}
 */
const UploadFilesContext = createContext({});

export default UploadFilesContext;
