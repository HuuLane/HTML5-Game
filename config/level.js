const sample = [
  [[100, 200], [100, 250]],
  [
    [200, 200],
    [275.6, 174.2],
    [350.6, 200.2],
    [425.6, 175.2],
    [124.6, 175.2],
    [48.6, 201.2],
    [501.6, 200.2],
  ],
]

const readStorage = name => {
  const s = window.localStorage.getItem(name)
  if (s) return JSON.parse(s)
}

let s = readStorage('gameLevel')

export default class Level {
  static load(level) {
    if (s) {
      console.log('读取到关卡', s)
      return s[level]
    } else {
      return sample[level]
    }
  }

  static save(levels) {
    // 修改内存中的关卡信息, 然后写入 localStorage
    s = levels
    localStorage.setItem('gameLevel', JSON.stringify(levels))
  }

  static clear() {
    localStorage.removeItem('gameLevel')
  }

  static length() {
    if (s) {
      return s.length
    } else {
      return sample.length
    }
  }
}
