import { log, imgsFromPath } from './utils.js'

class Game {
  constructor(imgs) {
    this.imgs = imgs
    this.update = function() {}
    this.draw = function() {}
    //
    this._canvas = document.querySelector('#id-canvas')
    this._context = this._canvas.getContext('2d')
    //
    this._actions = {}
    this._keydowns = {}
    this._listenKeyBoard()
    this._runTheGame()
  }

  _listenKeyBoard() {
    // events
    const g = this
    window.addEventListener('keydown', event => {
      g._keydowns[event.key] = true
    })
    window.addEventListener('keyup', event => {
      g._keydowns[event.key] = false
    })
  }

  _runTheGame() {
    const g = this
    // keyborad events
    for (const key in g._actions) {
      g._keydowns[key] && g._actions[key]()
    }
    // update
    g.update()
    // clear
    g._context.clearRect(0, 0, g._canvas.width, g._canvas.height)
    // draw
    g.draw()

    setTimeout(() => {
      g._runTheGame()
    }, 1000 / window.fps || 60)
  }

  drawElement(ele) {
    const i = ele.img
    this._context.drawImage(i, ele.x, ele.y, ele.height, ele.width)
  }

  registerAction(key, callback) {
    this._actions[key] = callback
  }
}

class Ball {
  constructor(game) {
    this.img = game.imgs.ball
    this.height = 30
    this.width = 30
    this.x = 100
    this.y = 200
    this.speedX = 5
    this.speedY = 5
    //
    this._fired = false
  }
  fire() {
    this._fired = true
  }
  move() {
    const o = this
    if (!o._fired) {
      return
    }
    // 碰壁
    if (o.x < 0 || o.x > 600) {
      o.speedX = -o.speedX
    }
    if (o.y < 0 || o.y > 400) {
      o.speedY = -o.speedY
    }
    // move
    o.x += o.speedX
    o.y += o.speedY
  }
}

const main = async () => {
  const imgs = await imgsFromPath({
    paddle: 'paddle',
    block: 'block',
    ball: 'ball',
  })
  log('imgs: ', imgs)
  const game = new Game(imgs)
  const ball = new Ball(game)

  game.registerAction('f', () => {
    ball.fire()
  })

  game.update = () => {
    ball.move()
  }
  game.draw = function() {
    // draw
    // game.drawImg(paddle)
    game.drawElement(ball)
  }
}

main()
