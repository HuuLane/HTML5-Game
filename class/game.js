export default class Game {
  constructor(imgs) {
    this.imgs = imgs
    this.update = function() {}
    this.draw = function() {}
    //
    this.canvas = document.querySelector('#id-canvas')
    this.context = this.canvas.getContext('2d')
    //
    this.actions = {}
    this.keydowns = {}
    this._listenKeyBoard()
    this._runTheGame()
  }

  _listenKeyBoard() {
    // events
    const g = this
    window.addEventListener('keydown', event => {
      g.keydowns[event.key] = true
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

  drawElement(ele) {
    this.context.drawImage(ele.img, ele.x, ele.y, ele.width, ele.height)
  }

  registerAction(key, callback) {
    this.actions[key] = callback
  }
}
