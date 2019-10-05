import { Circle } from '../class/element.js'

export default class Ball extends Circle {
  constructor(config) {
    super(config)
    this.img = window.imgs.ball
    this.height = 30
    this.width = 30
    this.speedX = 5
    this.speedY = 5
    //
    this._fired = false
  }
  fire() {
    this._fired = true
  }
  move() {
    const o = this
    if (!o._fired) {
      return
    }
    // 碰壁
    if (o.x < 0 || o.x > 600) {
      o.speedX = -o.speedX
    }
    if (o.y < 0 || o.y > 400) {
      o.speedY = -o.speedY
    }
    // move
    o.x += o.speedX
    o.y += o.speedY
  }
  collide(o, callback) {
    // 先找出距离球最近的点, 然后判断距离是否大于半径
    //
    // center coordinate of the circle
    let { x, y } = this.center
    // closest point
    let cx = 0
    let cy = 0
    if (x < o.left) {
      cx = o.left
    } else if (x > o.right) {
      cx = o.right
    } else {
      cx = x
    }

    if (y < o.top) {
      cy = o.top
    } else if (y > o.bottom) {
      cy = o.bottom
    } else {
      cy = y
    }

    if (this.hasPoint(cx, cy)) {
      callback()
    }
  }
}
