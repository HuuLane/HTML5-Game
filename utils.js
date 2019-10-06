const log = console.log.bind(console)

const resolveObj = obj => {
  // To resolve an obj into two arrs
  const ks = []
  const vs = []
  for (const [k, v] of Object.entries(obj)) {
    ks.push(k)
    vs.push(v)
  }
  return [ks, vs]
}

const clearObj = obj => Object.keys(obj).forEach(prop => delete obj[prop])

const imgFromPath = path => {
  // To transform a path into Promise
  const img = new Image()
  img.src = `imgs/${path}.png`
  return new Promise(resolve => {
    img.onload = () => {
      resolve(img)
    }
  })
}

const imgsFromPath = async paths => {
  const [keys, vs] = resolveObj(paths)
  // loads all imgs
  const values = await Promise.all(vs.map(v => imgFromPath(v)))
  return Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]))
}

const type = e => e.constructor.name

export { log, type, imgsFromPath, clearObj }
