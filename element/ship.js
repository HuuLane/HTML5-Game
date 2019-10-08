import { Rectangle } from '../class/element.js'

export default class Ship extends Rectangle {
  constructor(config) {
    // special for ship
    config.img = window.imgs.ship
    config.height = 24
    config.width = 16
    super(config)
    this.speedX = 10
    this.speedY = 5
    // this.animateSpeed = 3
  }
  moveTop() {
    const o = this
    // 碰壁
    if (o.y > 0) {
      o.y -= o.speedY
    }
  }
  moveBottom() {
    const o = this
    // 碰壁
    if (o.y + o.height < 342) {
      o.y += o.speedY
    }
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
    if (o.x + o.width < 256) {
      o.x += o.speedX
    }
  }
}
