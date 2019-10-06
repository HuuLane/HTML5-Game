import Scene from '../class/scene.js'
import Level from '../config/level.js'
import Ball from '../element/ball.js'
import Block from '../element/block.js'
import Paddle from '../element/paddle.js'

export default class Play extends Scene {
  constructor(game) {
    super(game)
    // game meta
    this.score = 0
    this.level = 0
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
    this.loadLevel()
    // debug
    this._debug()
  }

  get blocks() {
    return this._blocks.filter(b => b !== null)
  }

  get elements() {
    return [this.paddle, this.ball].concat(this.blocks)
  }

  loadLevel() {
    // level is int
    if (this.level === Level.length()) {
      // game over!
      this.game.renderScene('Home')
      return
    }
    // load
    this._blocks = []
    Level.load(this.level).forEach((b, i) => {
      this._blocks.push(new Block({ x: b[0], y: b[1], index: i }))
    })
    this.level++
  }

  // update & draw methods will cover game's
  // so the style is wild :)
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
      // 1. ball rebound
      // 2. block hp -= 1
      // 3. score += 1
      b.collide(block, () => {
        b.speedY *= -1
        block.kill()
        // delete the dead block
        if (block.isDead()) this._blocks[block.index] = null
        this.score += 1
      })
    }
    if (this.blocks.length === 0) {
      console.log('load next level')
      this.loadLevel()
    }
  }

  draw = () => {
    const g = this.game
    // draw
    this.elements.forEach(b => g.renderElement(b))
    g.renderText('score', `第 ${this.level} 关  得分 ${this.score}`)
    if (!this.ball._fired) {
      g.renderText('score', `按 f 开始`, 2)
    }
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
        for (const e of this.blocks.concat([s.paddle, s.ball])) {
          // 设置拖拽状态
          if (e.hasPoint(x, y)) {
            selected = e
            return
          }
        }
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
