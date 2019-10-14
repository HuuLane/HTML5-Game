import Scene from '../class/scene.js'
// import Level from '../config/level.js'
// import Ball from '../element/ball.js'
// Game elements
import { Laser, Bolt } from '../element/bolts.js'
import Ship from '../element/ship.js'
import { EnemyBig, EnemySmall } from '../element/enemies.js'
import Explosion from '../element/explosion.js'

const log = console.log.bind(console)
import { type } from '../utils.js'
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
    this._elements = []
    this._removedElementIndexes = []
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
    const Enemy = x % 2 === 0 ? EnemySmall : EnemyBig
    this.addElement(
      new Enemy({
        x,
        y: 1,
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

  get enemies() {
    return this.elements.filter(e => {
      return type(e) === 'EnemyBig' || type(e) === 'EnemySmall'
    })
  }

  get elements() {
    const r = this._elements.filter(e => e !== null)
    r.push(this.ship)
    return r
  }

  fireBolt(type) {
    if (this.fireCD) {
      return
    }
    const B = type === 'bolt' ? Bolt : Laser
    this.addElement(
      new B({
        // x: this.ship.x + this.ship.width / 2,
        x: this.ship.x,
        y: this.ship.y,
      }),
    )
    this.fireCD = true
  }

  explode(element) {
    const e = new Explosion({
      x: element.x + element.width / 3,
      y: element.y + element.height / 3,
    })
    e.animateCallback = () => {
      log('消失')
      this.removeElement(e)
    }
    this.addElement(e)
  }

  addElement(element) {
    let i = this._removedElementIndexes.shift()
    if (!i) {
      i = this._elements.length
    }
    element.index = i
    this._elements[i] = element
  }

  removeElement(e) {
    const i = e.index
    this._elements[i] = null
    this._removedElementIndexes.push(i)
    log('', this._elements)
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

  elementActions = {
    Laser(e, scene) {
      // 检测碰撞..
      scene.enemies.forEach(ene => {
        if (e.collide(ene)) {
          log('I am the Laser!', ene.x, ene.y)
          scene.removeElement(ene)
          // Explosion
          scene.explode(ene)
        }
      })
      // go beyond the boundary
      if (e.y < 0) {
        scene.removeElement(e)
      }
    },
    Bolt(e, scene) {
      // 检测碰撞..
      scene.enemies.forEach(ene => {
        if (e.collide(ene)) {
          log('I am a bolt!')
          scene.removeElement(e)
          scene.removeElement(ene)
        }
      })
      // go beyond the boundary
      if (e.y < 0) {
        scene.removeElement(e)
      }
    },
    Ship(e, scene) {},
    EnemyBig(e, scene) {
      if (e.y > 200) {
        scene.removeElement(e)
      }
    },
    EnemySmall(e, scene) {
      if (e.y > 200) {
        scene.removeElement(e)
      }
    },
    Explosion(e, scene) {},
  }

  // update & draw methods will cover game's
  // so the style is wild :)
  update = () => {
    if (this.pause) {
      return
    }

    this.genEnemies()
    this.refreshBoltCD()

    this.elements.forEach(e => {
      e.animate()
      e.move()
      // element callback
      this.elementActions[type(e)](e, this)
    })
  }

  draw = () => {
    const g = this.game
    // draw
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
