import Scene from '../class/scene.js'
import Level from '../config/level.js'

export default class Home extends Scene {
  constructor(game) {
    super(game)
    this.game = game
    this.registerKeyboards({
      r: () => game.renderScene('Play'),
      e: () => game.renderScene('Edit'),
      c: () => Level.clear(),
    })
  }

  draw = () => {
    this.game.renderText('score', '按 r 开始游戏, 按 e 编辑地图')
    this.game.renderText('score', '按 c 清除编辑记录', 2)
    this.game.renderText('title', '打砖块')
  }
}
