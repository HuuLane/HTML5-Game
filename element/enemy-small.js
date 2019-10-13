import { Rectangle } from '../class/element.js'

export default class EnemySmall extends Rectangle {
  constructor(config) {
    config.img = window.imgs['enemy-small']
    config.height = 16
    config.width = 16
    super(config)
    this.speedX = 0
    this.speedY = 1
    // play scene meta
    this.index = config.index
    // this.animateSpeed = 3
  }
  move() {
    const o = this
    // 碰壁
    o.y += o.speedY
  }
}
