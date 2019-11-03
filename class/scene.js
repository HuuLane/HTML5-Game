export default class Scene {
  constructor(game) {
    this.game = game
  }

  registerActions(actions) {
    for (const key in actions) {
      this.game.registerAction(key, actions[key])
    }
  }

  registerKeyboards(actions) {
    for (const key in actions) {
      this.game.registerKeyboard(key, actions[key])
    }
  }
}
