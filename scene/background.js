import Scene from '../class/scene.js'
import { Img } from '../class/element.js'

const log = console.log.bind(console)

export default class BackGround extends Scene {
  constructor (game) {
    super(game)
    this._speedBackground = 0.1
    this._mainBackground = new Img({
      img: window.imgs.background,
      x: 0,
      y: 0,
      width: 256,
      height: 608
    })
    this._minorBackground = new Img({
      img: window.imgs.background,
      x: 0,
      y: 0,
      width: 256,
      height: 608
    })

    this.init()
  }

  // registerActions(actions) {
  //   super.registerActions(actions)
  // }
  // registerKeyboards(actions) {
  //   super.registerKeyboards(actions)
  // }
  init () {
    // canvas height
    const height = 342

    const main = this._mainBackground
    main.y = -608 + height
  }

  update () {}

  draw () {
    const main = this._mainBackground
    const minor = this._minorBackground
    main.y += 1
    // log('main.y', main.y)
    if (main.y === 0) {
      // init minor
      log('等于 0 啦')
      minor.y = -608
    } else if (main.y > 0) {
      // log('min', main.y)
      minor.y += 1
      this.game.renderElement(minor)
      if (main.y === 342) {
        // change
        log('change')
        const tem = main
        this._mainBackground = minor
        this._minorBackground = tem
      }
    }
    this.game.renderElement(main)
  }
}
