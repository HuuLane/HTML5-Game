import { Rectangle } from '../class/element.js'

class Bolts extends Rectangle {
  constructor (config) {
    config.img = window.imgs.bolts
    config.height = 16
    config.width = 16
    super(config)
    // 这组图片有点特殊, 像素划分不规则, 只能硬编码了..
    this.imgs[0]._sx += 2
    this.imgs[2]._sx += 2
    this.speedX = 0
    this.speedY = 2
    this.animateSpeed = 10
    // play scene meta
  }

  collide (o) {
    const b = this
    if (
      b.left > o.right ||
      b.right < o.left ||
      b.top > o.bottom ||
      b.bottom < o.top
    ) {
      return false
    } else {
      return true
    }
  }

  move () {
    const o = this
    o.y -= o.speedY
  }
}

class Laser extends Bolts {
  constructor (config) {
    super(config)
    this.imgs.splice(0, 2)
  }
}

class Bolt extends Bolts {
  constructor (config) {
    super(config)
    this.imgs.splice(2, 4)
  }
}

export { Laser, Bolt }
