import { Rectangle } from '../class/element.js'

export default class Paddle extends Rectangle {
  constructor(config) {
    super(config)
    this.img = window.imgs.paddle
    this.height = 12.8 * 2
    this.width = 48.5 * 2
    this.x = 100
    this.y = 350
    this.speedX = 10
    this.speedY = 0
    //
  }
  moveLeft() {
    const o = this
    // 碰壁
    if (o.x > 0) {
      o.x -= o.speedX
    }
  }
  moveRight() {
    const o = this
    // 碰壁
    if (o.x < 600) {
      o.x += o.speedX
    }
  }
}
