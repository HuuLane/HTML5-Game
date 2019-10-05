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
    }, 1000 / (window.fps || 60))
  }

  drawElement(ele) {
    this.context.drawImage(ele.img, ele.x, ele.y, ele.width, ele.height)
  }

  registerAction(key, callback) {
    this.actions[key] = callback
  }
}

class Element {
  get left() {
    return this.x
  }
  get right() {
    return this.x + this.width
  }
  get top() {
    return this.y
  }
  get bottom() {
    return this.y + this.height
  }
}

class Ball extends Element {
  constructor(game) {
    super(game)
    //
    this.img = game.imgs.ball
    this.height = 30
    this.width = 30
    this.x = 100
    this.y = 200
    this.speedX = 5
    this.speedY = 5
    // set circle prop
    this.radius = this.width / 2
    //
    this._fired = false
  }
  get position() {
    const r = this.radius
    return {
      x: this.x + r,
      y: this.y + r,
    }
  }
  distance(x, y) {
    return Math.sqrt(
      Math.pow(this.position.x - x, 2) + Math.pow(this.position.y - y, 2),
    )
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
  collide(o, callback) {
    // 先找出距离球最近的点, 然后判断距离是否大于半径
    //
    // center coordinate of the circle
    let { x, y } = this.position
    // closest point
    let cx = 0
    let cy = 0
    if (x < o.left) {
      cx = o.left
    } else if (x > o.right) {
      cx = o.right
    } else {
      cx = x
    }

    if (y < o.top) {
      cy = o.top
    } else if (y > o.bottom) {
      cy = o.bottom
    } else {
      cy = y
    }

    log('this.distance(cx, cy)', this.distance(cx, cy))
    if (this.distance(cx, cy) < this.radius) {
      callback()
    }
  }
}

class Paddle extends Element {
  constructor(game) {
    super(game)
    this.img = game.imgs.paddle
    // this.img.height = 12.8 * 2
    // this.img.width = 48.5 * 2
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

class Block extends Element {
  constructor(game) {
    super(game)
    this.img = game.imgs.block
    this.x = 10
    this.y = 10
    this.width = 38.4 * 2
    this.height = 12.8 * 2
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
  const block = new Block(game)
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
    ball.collide(paddle, () => {
      log('撞上了')
      ball.speedY *= -1
    })
    ball.collide(block, () => {
      log('撞上了')
      ball.speedY *= -1
    })
  }
  game.draw = function() {
    // draw
    game.drawElement(paddle)
    game.drawElement(block)
    game.drawElement(ball)
  }
}

main()
