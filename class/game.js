import textConfig from '../config/font.js'
import Home from '../scene/home.js'
import Play from '../scene/play.js'
import BackGround from '../scene/background.js'
import { log, clearObj } from '../utils.js'

const scenes = {
  Home,
  Play,
}

let firstInit = true

export default class Game {
  static new() {
    if (firstInit) {
      firstInit = false
      const game = new Game('Home')
    } else {
      throw Error("Game can't be instanced twice")
    }
  }

  constructor(initScene) {
    //
    this.canvas = document.querySelector('#id-canvas')
    this.context = this.canvas.getContext('2d')
    //
    this.actions = {}
    this.keyRecord = {}
    this.mouseRecord = {}
    this.keydowns = {}
    this._listenKeyBoard()
    this._initGame(initScene)
    this._runTheGame()
  }

  _listenKeyBoard() {
    // events
    const g = this
    window.addEventListener('keydown', event => {
      g.keydowns[event.key] = true
      g.keyRecord[event.key] && g.keyRecord[event.key]()
    })
    window.addEventListener('keyup', event => {
      g.keydowns[event.key] = false
    })
  }

  _initGame(initScene) {
    // init BackGround
    this._background = new BackGround(this)
    this.renderScene(initScene)
  }

  _runTheGame() {
    const g = this
    // keyborad events
    for (const key in g.actions) {
      g.keydowns[key] && g.actions[key]()
    }
    // update
    g.update()
    // clear
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
    // draw
    g.draw()

    setTimeout(() => {
      g._runTheGame()
    }, 1000 / (window.fps || 30))
  }

  renderElement(ele) {
    const i = ele.img
    this.context.drawImage(
      i._img,
      i._sx,
      i._sy,
      i._sw,
      i._sh,
      ele.x,
      ele.y,
      ele.width,
      ele.height,
    )
  }

  renderText(type, text, line = 1) {
    // read conf
    const s = textConfig[type]

    const ctx = this.context
    ctx.font = s.font
    ctx.fillStyle = s.color
    ctx.textAlign = 'center'
    ctx.fillText(text, s.position[0], s.position[1] * line)
  }

  renderScene(sceneName, ...args) {
    // 清除之前场景绑定的键位, 鼠标事件
    this.clearKeyboard()
    this.clearMouse()
    // 切换新场景
    const Scene = scenes[sceneName]
    const s = new Scene(this, ...args)
    this.scene = s
  }

  registerAction(key, callback) {
    // 控制游戏元素的键, 比如 f 开火, ad 移动 paddle
    this.actions[key] = callback
  }

  registerKeyboard(key, callback) {
    // 和游戏元素无关的键, 比如 P 暂停游戏..
    this.keyRecord[key] = callback
  }

  clearKeyboard() {
    clearObj(this.actions)
    clearObj(this.keyRecord)
  }

  recordMouse(mouseActions) {
    for (const [type, callback] of Object.entries(mouseActions)) {
      this.mouseRecord[type] = e => callback(e.offsetX, e.y, e)
      this.canvas.addEventListener(type, this.mouseRecord[type])
    }
  }

  clearMouse() {
    const r = this.mouseRecord
    for (const k in r) {
      this.canvas.removeEventListener(k, r[k])
    }
    clearObj(r)
  }

  update() {
    this._background.update()
    this.scene.update()
  }

  draw() {
    this._background.draw()
    this.scene.draw()
  }
}
