import { log, imgsFromPath } from './utils.js'

import Game from './class/game.js'

const main = async () => {
  // load imgs
  const imgs = await imgsFromPath({
    background: 'background',
    clouds: 'clouds',
    'clouds-transparent': 'clouds-transparent',
    'enemy-big': 'enemy-big',
    'enemy-medium': 'enemy-medium',
    'enemy-small': 'enemy-small',
    explosion: 'explosion',
    bolts: 'bolts',
    ship: 'ship',
  })

  log('imgs:', imgs)
  window.imgs = imgs
  // run the game
  Game.new()
}

main()
