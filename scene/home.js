import BackGround from './background.js'

export default class Play extends BackGround {
  constructor(game) {
    super(game)
    this.game = game
    this.registerKeyboards({
      r: () => game.renderScene('Play'),
    })
  }

  update() {
    super.update()
  }
  draw() {
    super.draw()
    this.game.renderText('score', '按 r 开始游戏')
    this.game.renderText('score', '按 K 发射子弹, L 发射镭射电波', 2)
    this.game.renderText('title', 'STG')
  }
}
