import { log } from './utils.js'
import Game from './class/game.js'

const zip = function * (a, b) {
  // Note: specially in my case that a: Iterator b: Array
  for (const [i, value] of Array.from(a).entries()) {
    yield [value, b[i]]
  }
}

const imgFromPath = path => {
  // To transform a path into Promise
  const img = new window.Image()
  img.src = path
  return new Promise(resolve => {
    img.onload = () => resolve(img)
  })
}

const imgsFromPath = async paths => {
  // convert a plain object into an ES6 Map
  const pathMap = new Map(Object.entries(paths))
  // loads all imgs
  const loadedImgs = await Promise.all(
    Array.from(pathMap.values(), p => imgFromPath(p))
  )
  return Object.fromEntries(zip(pathMap.keys(), loadedImgs))
}

;(async function main () {
  // load imgs
  const imgs = await imgsFromPath({
    background: 'imgs/background.png',
    clouds: 'imgs/clouds.png',
    'clouds-transparent': 'imgs/clouds-transparent.png',
    'enemy-big': 'imgs/enemy-big.png',
    'enemy-medium': 'imgs/enemy-medium.png',
    'enemy-small': 'imgs/enemy-small.png',
    explosion: 'imgs/explosion.png',
    bolts: 'imgs/bolts.png',
    ship: 'imgs/ship.png'
  })

  log('imgs:', imgs)
  window.imgs = imgs
  // run the game
  Game.new()
})()
