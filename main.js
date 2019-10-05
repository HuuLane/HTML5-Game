import { log, imgsFromPath } from './utils.js'

import Game from './class/game.js'
import Ball from './element/ball.js'
import Block from './element/block.js'
import Paddle from './element/paddle.js'

const main = async () => {
  // load imgs
  const imgs = await imgsFromPath({
    paddle: 'paddle',
    block: 'block',
    ball: 'ball',
  })
  log('imgs:', imgs)
  window.imgs = imgs

  const game = new Game()
  const ball = new Ball({
    x: 200,
    y: 100,
  })
  const paddle = new Paddle({
    x: 100,
    y: 350,
  })
  const block = new Block({
    x: 50,
    y: 50,
  })
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
