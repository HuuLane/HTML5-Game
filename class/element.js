const GameImg = function(img, sx, sy, sw, sh) {
  // can't be modified
  this._img = img
  this._sx = sx
  this._sy = sy
  this._sw = sw
  this._sh = sh
}

class Element {
  constructor(config) {
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this._parseSourceImg(config.img, config.width, config.height)
    // animate
    this._imgIndex = 0
    this._breakTime = 0
    this.animateSpeed = 10
    this.animateCallback = function() {}
  }

  _parseSourceImg(img, spritesWidth, spritesHeight) {
    // abbr
    const w = spritesWidth
    const h = spritesHeight
    //
    const nx = img.width / w
    const ny = img.height / h

    this.imgs = []
    for (let iy = 0; iy < ny; iy++) {
      for (let ix = 0; ix < nx; ix++) {
        this.imgs.push(new GameImg(img, ix * w, iy * h, w, h))
      }
    }
    // default
    this.img = this.imgs[0]
  }

  animate() {
    if (this._imgIndex === this.imgs.length) {
      // 一轮动画播放完毕
      this._imgIndex = 0
      this.animateCallback()
    }

    this.img = this.imgs[this._imgIndex]

    if (this._breakTime === this.animateSpeed) {
      this._imgIndex += 1
      this._breakTime = 0
    } else {
      this._breakTime += 1
    }
  }

  move() {}
}

class Circle extends Element {
  constructor(config) {
    super(config)
  }
  get radius() {
    return this.width / 2
  }
  get center() {
    // center coordinates of the circle
    const r = this.radius
    return {
      x: this.x + r,
      y: this.y + r,
    }
  }
  distance(x, y) {
    return Math.sqrt(
      Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2),
    )
  }
  hasPoint(x, y) {
    // if one point in the circle
    return this.distance(x, y) <= this.radius
  }
}

class Rectangle extends Element {
  constructor(config) {
    super(config)
  }

  get left() {
    return this.x
  }

  get right() {
    return this.x + this.width
  }

  get top() {
    return this.y
  }

  get bottom() {
    return this.y + this.height
  }

  hasPoint(x, y) {
    // if one point in the rec
    return (
      this.left <= x && this.right >= x && this.top <= y && this.bottom >= y
    )
  }
}

export { Circle, Rectangle }
