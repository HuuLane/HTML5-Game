import { Rectangle } from '../class/element.js'

export default class Block extends Rectangle {
  constructor(config) {
    super(config)
    this.img = window.imgs.block
    this.width = 38.4 * 2
    this.height = 12.8 * 2
  }
}
