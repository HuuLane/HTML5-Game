import Scene from '../class/scene.js'
import Ball from '../element/ball.js'
import Block from '../element/block.js'
import Paddle from '../element/paddle.js'

export default class Play extends Scene {
  constructor(game) {
    super(game)
    //
    this.pause = false
    // init element
    this.ball = new Ball({
      x: 200,
      y: 100,
    })
    this.paddle = new Paddle({
      x: 100,
      y: 350,
    })
    this._blocks = []
    // keyboard
    this.registerActions({
      f: () => this.ball.fire(),
      a: () => this.paddle.moveLeft(),
      d: () => this.paddle.moveRight(),
    })
    // read Level
    this.readLevel()
    // debug
    this._debug()
  }

  get blocks() {
    return this._blocks.filter(b => b !== null)
  }

  readLevel() {
    const level = [[100, 200], [100, 300]]
    level.forEach((b, i) => {
      this._blocks.push(new Block({ x: b[0], y: b[1], index: i }))
    })
  }

  update = () => {
    if (this.pause) {
      return
    }
    const b = this.ball
    b.move()
    b.collide(this.paddle, () => {
      b.speedY *= -1
    })
    for (const block of this.blocks) {
      b.collide(block, () => {
        b.speedY *= -1
        block.kill()
        // delete the dead block
        if (block.isDead()) this._blocks[block.index] = null
      })
    }
  }

  draw = () => {
    const game = this.game
    // draw
    game.drawElement(this.paddle)
    game.drawElement(this.ball)
    this.blocks.forEach(b => this.game.drawElement(b))
  }

  _debug() {
    const s = this
    const g = s.game

    // 按 p 暂停
    g.registerKeyboard('p', () => (s.pause = !s.pause))

    // 拖拽
    let selected = null
    const mouseActions = {
      mousedown: (x, y) => {
        // 检查是否点中了 element
        this.blocks.concat([s.paddle, s.ball]).forEach(e => {
          // 设置拖拽状态
          if (e.hasPoint(x, y)) selected = e
        })
      },
      mousemove: (x, y) => {
        if (selected) {
          selected.x = x - selected.width / 2
          selected.y = y - selected.height / 2
        }
      },
      mouseup: (x, y) => {
        selected = null
        console.log(`鼠标释放点 x: ${x}, y:${y}`)
      },
    }
    g.recordMouse(mouseActions)
  }
}
