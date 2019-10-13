import Scene from '../class/scene.js'
// import Level from '../config/level.js'
// import Ball from '../element/ball.js'
// Game elements
import { Laser, Bolt } from '../element/bolts.js'
import Ship from '../element/ship.js'
import EnemySmall from '../element/enemy-small.js'

const log = console.log.bind(console)
const random = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min

export default class Play extends Scene {
  constructor(game) {
    super(game)
    // game meta
    this.score = 0
    this.level = 0
    this.pause = false
    // init element
    this.ship = new Ship({
      x: 100,
      y: 100,
    })
    this._bolts = []
    this._enemies = []
    // keyboard
    this.registerActions({
      k: () => this.fireBolt('bolt'),
      l: () => this.fireBolt('laser'),
      a: () => this.ship.moveLeft(),
      d: () => this.ship.moveRight(),
      w: () => this.ship.moveTop(),
      s: () => this.ship.moveBottom(),
    })
    // read Level
    // this.loadLevel()
    // debug
    // this._debug()
    //
    // bolt CD
    this.fireCD = false
    this._CDTime = 15
    this._fireBreak = 0
    this._genBreak = 0
  }

  refreshBoltCD() {
    if (!this.fireCD) {
      // 没有在 CD 就不刷新
      return
    }
    this._fireBreak += 1
    if (this._fireBreak === this._CDTime) {
      this._fireBreak = 0
      this.fireCD = false
    }
  }

  genEnemy() {
    const x = random(20, 230)
    const i = this._enemies.length
    this._enemies.push(
      new EnemySmall({
        x,
        y: 1,
        index: i,
      }),
    )
  }

  genEnemies() {
    if (this._genBreak === this._CDTime * 4) {
      this.genEnemy()
      this._genBreak = 0
    } else {
      this._genBreak++
    }
  }
  get bolts() {
    return this._bolts.filter(b => b !== null)
  }

  get enemies() {
    return this._enemies.filter(b => b !== null)
  }

  get elements() {
    return [this.ship].concat(this.bolts).concat(this.enemies)
  }

  fireBolt(type) {
    if (this.fireCD) {
      return
    }
    const B = type === 'bolt' ? Bolt : Laser
    const i = this._bolts.length
    this._bolts.push(
      new B({
        index: i,
        // x: this.ship.x + this.ship.width / 2,
        x: this.ship.x,
        y: this.ship.y,
      }),
    )
    this.fireCD = true
  }

  fadeBolt(bolt) {
    this._bolts[bolt.index] = null
  }

  fadeEnemy(e) {
    this._enemies[e.index] = null
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

    this.genEnemies()
    this.elements.forEach(e => {
      e.animate()
      e.move()
    })

    this.enemies.forEach(e => {
      if (e.y > 200) {
        this.fadeEnemy(e)
      }
    })
    this.refreshBoltCD()

    this.bolts.forEach(b => {
      // 检测碰撞..
      this.enemies.forEach(e => {
        if (b.collide(e)) {
          log('碰到了')
          this.fadeEnemy(e)
        }
      })
      // go beyond the boundary
      if (b.y < 0) {
        this.fadeBolt(b)
      }
    })
    // const b = this.ball
    // b.move()
    // b.collide(this.paddle, () => {
    //   b.speedY *= -1
    // })
    // for (const block of this.blocks) {
    //   // 1. ball rebound
    //   // 2. block hp -= 1
    //   // 3. score += 1
    //   b.collide(block, () => {
    //     b.speedY *= -1
    //     block.kill()
    //     // delete the dead block
    //     if (block.isDead()) this._blocks[block.index] = null
    //     this.score += 1
    //   })
    // }
    // if (this.blocks.length === 0) {
    //   console.log('load next level')
    //   this.loadLevel()
    // }
  }

  draw = () => {
    const g = this.game
    // draw
    // g.renderElement(this.ship)
    this.elements.forEach(e => g.renderElement(e))
    // g.renderText('score', `第 ${this.level} 关  得分 ${this.score}`)
    // if (!this.ball._fired) {
    //   g.renderText('score', `按 f 开始`, 2)
    // }
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
