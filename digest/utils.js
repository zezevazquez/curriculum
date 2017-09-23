const Path = require('path')
const fs = require('fs-extra')
const lexer = require('marked').lexer

const APP_ROOT = Path.resolve(__dirname, '..')

const promiseMap = function(map){
  const keys = Object.keys(map)
  const promises = keys.map(key => map[key])
  return Promise.all(promises).then(values => {
    const map = {}
    keys.forEach((key, index) => {
      map[key] = values[index]
    })
    return map
  })
}

const convertIdsToObjects = ids =>
  ids.map(id => ({id}))

const mapToObjectBy = (records, property) => {
  const map = {}
  records.forEach(record => {
    map[record[property]] = record
  })
  return map
}

const readdir = path =>
  fs.readdir(APP_ROOT+path).then(files =>
    files.filter(file => file[0] !== '.')
  )

const loadDirectoriesWithREADMEs = path => {
  const readREADME = file =>
    readMarkdownFile(
      Path.join(path, file.id, 'README.md')
    ).catch(error => {
      console.log('ERRRRRRR', error)
      return false
    })

  return readdir(path)
  .then(files => files.sort())
  .then(convertIdsToObjects)
  .then(files =>
    Promise.all(files.map(readREADME)).then(readmes => {
      files.forEach((file, index) => { file.readme = readmes[index] })
      return files.filter(file => file.readme)
    })
  )

}

const readFile = path =>
  fs.readFile(APP_ROOT+path)

const readMarkdownFile = path =>
  readFile(path)
    .then(file => lexer(file.toString()))

const nameToId = name =>
  name
    .replace(/^\s*/,'')
    .replace(/\s*$/,'')
    .replace(/[\/ #]/g, '-')
    .replace(/`/g, '')

const rawTextToName = rawText =>
  rawText
    .replace(/^\s*\[\s+\]\s+/, '')
    .replace(/^\s*/,'')
    .replace(/\s*$/,'')

const extractListFromMarkdownSection = (document, text, depth) => {
  // console.log('===== extractListFromMarkdownSection ====', text, depth)
  let
    items = [],
    withinSection = false,
    withinListItem = false,
    listItemText = ''

  document.forEach(token => {
    // console.log(withinSection, withinListItem, token)

    if (
      token.type === 'heading' &&
      (depth && token.depth <= depth)
    ) withinSection = false

    if (
      token.type === 'heading' &&
      ( depth !== undefined && token.depth === depth ) &&
      token.text === text
    ) withinSection = true

    if (!withinSection) return

    if (token.type === 'list_item_start') withinListItem = true

    if (token.type === 'list_item_end') {
      withinListItem = false
      items.push(listItemText)
      listItemText = ''
    }

    if (!withinListItem) return

    if (token.type === 'space') listItemText += ' '
    if (token.type === 'text') listItemText += token.text
  })
  return items
}


 module.exports = {
  APP_ROOT,
  mapToObjectBy,
  convertIdsToObjects,
  promiseMap,
  readdir,
  readFile,
  readMarkdownFile,
  rawTextToName,
  nameToId,
  extractListFromMarkdownSection,
  loadDirectoriesWithREADMEs,
 }
