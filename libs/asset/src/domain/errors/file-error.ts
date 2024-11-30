export abstract class FileError extends Error {
  abstract code: string
  abstract status: number
}
