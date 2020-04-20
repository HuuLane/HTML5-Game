import { Rectangle } from '../class/element.js'

export default class Explosion extends Rectangle {
  constructor (config) {
    // special for ship
    config.img = window.imgs.explosion
    config.height = 16
    config.width = 16
    super(config)
  }
}
