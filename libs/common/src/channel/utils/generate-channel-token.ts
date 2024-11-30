import { randomBytes } from 'crypto'

export const generateChannelToken = (): string => {
  const prefix = 'ch_'
  const randomString = randomBytes(10).toString('hex')
  return `${prefix}${randomString}`
}
