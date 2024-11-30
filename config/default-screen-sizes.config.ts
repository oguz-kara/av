import { DefaultScreenSizeItem } from './default-screen-size-item.type'

export const defaultScreenSizes: Record<string, DefaultScreenSizeItem> = {
  tiny: {
    width: 50,
    height: 50,
    mode: 'crop',
  },
  thumb: {
    width: 150,
    height: 150,
    mode: 'crop',
  },
  small: {
    width: 300,
    height: 'auto',
    mode: 'resize',
  },
  medium: {
    width: 500,
    height: 'auto',
    mode: 'resize',
  },
  large: {
    width: 800,
    height: 'auto',
    mode: 'resize',
  },
  preview: {
    width: 1024,
    height: 'auto',
    mode: 'resize',
  },
}
