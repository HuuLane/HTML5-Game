import { log, imgsFromPath } from './utils.js'

class Game {
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
    }, 1000 / window.fps || 60)
  }

  drawElement(ele) {
    this.context.drawImage(ele.img, ele.x, ele.y, ele.width, ele.height)
  }

  registerAction(key, callback) {
    this.actions[key] = callback
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

class Paddle {
  constructor(game) {
    this.img = game.imgs.paddle
    this.height = 12.8 * 2
    this.width = 48.5 * 2
    this.x = 100
    this.y = 350
    this.speedX = 10
    // this.speedY = 5
    //
  }
  moveLeft() {
    const o = this
    // 碰壁
    if (o.x > 0) {
      o.x -= o.speedX
    }
  }
  moveRight() {
    const o = this
    // 碰壁
    if (o.x < 600) {
      o.x += o.speedX
    }
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
  const paddle = new Paddle(game)
  game.registerAction('f', () => {
    ball.fire()
  })
  game.registerAction('a', () => {
    paddle.moveLeft()
  })
  game.registerAction('d', () => {
    paddle.moveRight()
  })

  game.update = () => {
    ball.move()
  }
  game.draw = function() {
    // draw
    game.drawElement(paddle)
    game.drawElement(ball)
  }
}

main()
