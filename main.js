import { log, imgsFromPath } from './utils.js'

import Game from './class/game.js'
import Play from './scene/play.js'

const main = async () => {
  // load imgs
  const imgs = await imgsFromPath({
    paddle: 'paddle',
    block: 'block',
    ball: 'ball',
  })
  log('imgs:', imgs)
  window.imgs = imgs

  // run the game
  Game.new()
}

main()
