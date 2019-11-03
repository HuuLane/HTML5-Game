import BackGround from './background.js'
// Game elements
import { Laser, Bolt } from '../element/bolts.js'
import Ship from '../element/ship.js'
import { EnemyBig, EnemySmall } from '../element/enemies.js'
import Explosion from '../element/explosion.js'

const log = console.log.bind(console)
import { type } from '../utils.js'
const random = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min

export default class Play extends BackGround {
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
    // debug
    this._debug()
    //
    this.score = 0
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
    // random enemy
    const x = random(20, 230)
    const Enemy = x % 2 === 0 ? EnemySmall : EnemyBig
    this.addElement(
      new Enemy({
        x,
        y: -30,
      }),
    )
  }

  genEnemies() {
    if (this._genBreak === this._CDTime * 6) {
      this.genEnemy()
      this._genBreak = 0
    } else {
      this._genBreak++
    }
  }

  damageEnemy(ene) {
    ene.hp -= 1
    if (ene.hp === 0) {
      this.removeElement(ene)
      this.explode(ene)
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
    } else {
      this.fireCD = true
      // fire a bolt near the ship
      const B = type === 'bolt' ? Bolt : Laser
      this.addElement(
        new B({
          x: this.ship.x,
          y: this.ship.y,
        }),
      )
    }
  }

  explode(element) {
    let x = element.x
    let y = element.y
    if (type(element) === 'EnemyBig') {
      x += element.width / 3
      y += element.height / 3
    }
    const e = new Explosion({
      x,
      y,
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
    //
    this.score += 1
  }

  elementActions = {
    Laser(e, scene) {
      // 检测碰撞..
      scene.enemies.forEach(ene => {
        if (e.collide(ene)) {
          log('I am the Laser!')
          // scene.removeElement(ene)
          scene.damageEnemy(ene)
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
          scene.damageEnemy(ene)
        }
      })
      // go beyond the boundary
      if (e.y < 0) {
        scene.removeElement(e)
      }
    },
    Ship(e, scene) {},
    EnemyBig(e, scene) {
      if (e.y > 342 + 20) {
        scene.gameOver()
        // scene.removeElement(e)
      }
    },
    EnemySmall(e, scene) {
      if (e.y > 342 + 20) {
        scene.gameOver()
        // scene.removeElement(e)
      }
    },
    Explosion(e, scene) {},
  }

  gameOver() {
    this.game.renderScene('Home', this.score)
  }

  update() {
    super.update()
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

  draw() {
    super.draw()
    const g = this.game
    // draw
    this.elements.forEach(e => g.renderElement(e))
    g.renderText('score', `得分 ${this.score}`)
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
        for (const e of this.elements) {
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
