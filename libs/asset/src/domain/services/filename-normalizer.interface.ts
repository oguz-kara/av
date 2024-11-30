export interface IFilenameNormalizer {
  normalize(originalName: string, fileType: string): string
}
