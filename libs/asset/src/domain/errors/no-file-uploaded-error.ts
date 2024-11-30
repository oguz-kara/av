import { FileError } from './file-error'

export class NoFileUploadedError extends FileError {
  code = 'NO_FILE_UPLOADED'
  status = 400
  constructor() {
    super('No file uploaded')
    this.name = 'NO_FILE_UPLOADED_ERROR'
  }
}
