import { Rectangle } from '../class/element.js'

export default class Block extends Rectangle {
  constructor(config) {
    super(config)
    this.img = window.imgs.block
    this.width = 38.4 * 2
    this.height = 12.8 * 2
    this.lives = 1
  }

  kill() {
    if (this.lives > 0) {
      this.lives -= 1
    }
  }

  isDead() {
    return this.lives < 1
  }
}
