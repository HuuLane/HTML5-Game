import textConfig from '../config/font.js'

export default class Game {
  constructor() {
    this.update = function() {}
    this.draw = function() {}
    //
    this.canvas = document.querySelector('#id-canvas')
    this.context = this.canvas.getContext('2d')
    //
    this.actions = {}
    this.keyRecord = {}
    this.mouseRecord = {}
    this.keydowns = {}
    this._listenKeyBoard()
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
    }, 1000 / (window.fps || 60))
  }

  renderElement(ele) {
    this.context.drawImage(ele.img, ele.x, ele.y, ele.width, ele.height)
  }

  renderText(type, text) {
    // read conf
    const s = textConfig[type]

    const ctx = this.context
    ctx.font = s.font
    ctx.fillStyle = s.color
    ctx.textAlign = 'center'
    ctx.fillText(text, s.position[0], s.position[1])
  }

  registerAction(key, callback) {
    // 控制游戏元素的键, 比如 f 开火, ad 移动 paddle
    this.actions[key] = callback
  }

  registerKeyboard(key, callback) {
    // 和游戏元素无关的键, 比如 P 暂停游戏..
    this.keyRecord[key] = callback
  }

  recordMouse(mouseActions) {
    for (const [type, callback] of Object.entries(mouseActions)) {
      this.mouseRecord[type] = e => callback(e.offsetX, e.y, e)
      this.canvas.addEventListener(type, this.mouseRecord[type])
    }
  }
}
