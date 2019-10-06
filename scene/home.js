import Scene from '../class/scene.js'

export default class Home extends Scene {
  constructor(game) {
    super(game)
    this.game = game
    this.registerActions({
      r: () => game.renderScene('Play'),
      e: () => game.renderScene('edit'),
    })
  }

  draw = () => {
    this.game.renderText('score', '按 r 开始游戏, 按 e 编辑地图')
    this.game.renderText('title', '打砖块')
  }
}
