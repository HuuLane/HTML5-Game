class Element {
  constructor(config) {
    this.x = config.x
    this.y = config.y
  }
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
