import { FileError } from './file-error'

export class UnsupportedFileError extends FileError {
  code = 'UNSUPPORTED_FILE'
  status = 415
  constructor(message?: string) {
    super(message ? message : 'Unsupported file')
    this.name = 'UNSUPPORTED_FILE_ERROR'
  }
}
