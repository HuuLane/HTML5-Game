import Scene from '../class/scene.js'
import Level from '../config/level.js'
import Ball from '../element/ball.js'
import Block from '../element/block.js'
import Paddle from '../element/paddle.js'
import { log, type } from '../utils.js'

const editCache = []

export default class Edit extends Scene {
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
      log('load next level')
      this.loadLevel()
    }
  }

  draw = () => {
    const g = this.game
    // draw
    this.elements.forEach(b => g.renderElement(b))
    g.renderText(
      'score',
      `当前编辑: 第 ${this.level} 关 有 ${this.blocks.length} 块砖`,
    )
    g.renderText('score', `按 n 编辑下一关`, 2)
    g.renderText('score', `按 s 保存并返回首页`, 3)
    g.renderText('score', `小提示: 可以用小球当橡皮擦哟`, 4)
  }

  _debug() {
    const s = this
    const g = s.game

    // 按 p 暂停
    // n 编辑下一关
    // s 保存并回到 home page
    s.registerKeyboards({
      p: () => (s.pause = !s.pause),
      n: () => {
        this._saveToCache()
        // 刷新地图, 尝试读取之前的资料
        this._blocks = []
        if (Level.load(this.level)) {
          Level.load(this.level).forEach((b, i) => {
            this._blocks.push(new Block({ x: b[0], y: b[1], index: i }))
          })
        } else {
          // 至少得来一关, 不然 blocks 为 0 时会调用 loadLevel 加载到游戏
          this._blocks.push(new Block({ x: 300, y: 300, index: 0 }))
        }
        this.level += 1
      },
      s: () => {
        Level.save(editCache)
        g.renderScene('Home')
      },
    })

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
        // 没有点中, 则新建一个 block
        selected = new Block({ x, y, index: this._blocks.length })
        this._blocks.push(selected)
        // 为了 UE
        selected.x = x - selected.width / 2
        selected.y = y - selected.height / 2
      },
      mousemove: (x, y) => {
        if (selected) {
          selected.x = x - selected.width / 2
          selected.y = y - selected.height / 2
        }
      },
      mouseup: (x, y) => {
        // 如果移动了 球或砖块, 读取所有砖块的坐标
        if (selected && ['Block', 'Ball'].includes(type(selected))) {
          this._saveToCache()
        }
        selected = null
        log(`鼠标释放点 x: ${x}, y:${y}`)
      },
    }
    g.recordMouse(mouseActions)
  }

  _saveToCache() {
    const editResult = this.blocks.map(b => [b.x, b.y])
    editCache[this.level - 1] = editResult
    // check 一下~
    const info = JSON.stringify(editCache)
    log('info', info)
  }
}