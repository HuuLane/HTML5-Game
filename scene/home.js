// import BackGround from './background.js'
import Scene from '../class/scene.js'
// export default class Play extends BackGround {
export default class Play extends Scene {
  constructor (game, score) {
    super(game)
    this.game = game
    this.score = score
    this.registerKeyboards({
      r: () => game.renderScene('Play')
    })
  }

  update () {
    // super.update()
  }

  draw () {
    // super.draw()
    if (this.score) {
      this.game.renderText('score', `Score: ${this.score}`, 3)
      this.game.renderText('title', 'GAME OVER')
    } else {
      this.game.renderText('title', '绝命荒谷')
    }
  }
}
