// import BackGround from './background.js'
import Scene from '../class/scene.js'
// export default class Play extends BackGround {
export default class Play extends Scene {
  constructor(game, score) {
    super(game)
    this.game = game
    this.score = score
    this.registerKeyboards({
      r: () => game.renderScene('Play'),
    })
  }

  update() {
    // super.update()
  }
  draw() {
    // super.draw()
    this.game.renderText('score', '按 r 开始游戏')
    this.game.renderText('score', '按 K 发射子弹, L 发射镭射电波', 2)
    if (this.score) {
      this.game.renderText('score', `上把得分${this.score}`, 3)
      this.game.renderText('title', 'GAME OVER')
    } else {
      this.game.renderText('title', 'STG')
    }
  }
}
