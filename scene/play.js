import Scene from '../class/scene.js'
import Ball from '../element/ball.js'
import Block from '../element/block.js'
import Paddle from '../element/paddle.js'

export default class Play extends Scene {
  constructor(game) {
    super(game)
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
    const b = this.ball
    b.move()
    b.collide(this.paddle, () => {
      b.speedY *= -1
    })
    for (const block of this.blocks) {
      b.collide(block, () => {
        b.speedY *= -1
        block.kill()
        if (block.isDead()) {
          // delete the dead block
          this._blocks[block.index] = null
        }
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
}
