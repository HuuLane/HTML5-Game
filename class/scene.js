export default class Scene {
  constructor(game) {
    this.game = game
    this.draw = function() {}
    this.update = function() {}
  }

  registerActions(actions) {
    for (const key in actions) {
      this.game.registerAction(key, actions[key])
    }
  }

  setup() {
    const scene = this
    scene.game.draw = scene.draw
    scene.game.update = scene.update
  }
}
