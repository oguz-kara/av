import { FileError } from './file-error'

export class FileTooLargeError extends FileError {
  code = 'FILE_TOO_LARGE'
  status = 413
  constructor(value: number) {
    super('File too large. Max file size is ' + value + 'MB')
    this.name = 'FILE_TOO_LARGE_ERROR'
  }
}
