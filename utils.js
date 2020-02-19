const log = console.log.bind(console)

const clearObj = obj => Object.keys(obj).forEach(prop => delete obj[prop])

const type = e => e.constructor.name

export { log, type, clearObj }
