const {
  readDirectoriesWithREADMEs,
  extractListFromMarkdownSection,
} = require('./utils')

module.exports = () =>
  readDirectoriesWithREADMEs('/phases')
  .then(extractModules)

const extractModules = phases => {
  phases.forEach(phase => {
    const modules = extractListFromMarkdownSection(
      phase.READMEMarkdown,
      'Modules',
      2,
    )
    phase.modules = modules.map(extractModuleId)
  })
  return phases
}

// const utils = require('./utils')

// module.exports = () =>
//   utils.readdir('/phases')
//     .then(phaseNumbers =>
//       phaseNumbers.filter(phaseNumber => phaseNumber == Number(phaseNumber))
//     )
//     .then(phaseNumbersToPhases)
//     .then(loadDetails)
//     .then(indexByNumber)

// const phaseNumbersToPhases = numbers =>
//   numbers.map(number => (
//     {
//       number: Number.parseInt(number),
//       path: `/phases/${number}`,
//     }
//   ))

// const loadDetails = phases =>
//   Promise.all(
//     phases.map(phase =>
//       utils.readMarkdownFile(`${phase.path}/README.md`)
//       .then(document => {
//         phase.modules =
//           utils.extractListFromSection(document, 'Modules', 2)
//           .map(parseModuleText)
//         return document
//       })
//       .then(_ => phase)
//     )
//   )

// const indexByNumber = phases =>
//   phases.reduce((index, phase) => {
//     index[phase.number] = phase
//     return index
//   }, {})

// const isModulesHeading = token =>
//   token.type === 'heading' &&
//   token.depth === 2 &&
//   token.text === 'Modules'

const extractModuleId = (text) => {
  const matches = text.match(/([^\[]+?)\s*\[([^\]]+)\]\(([^\(]+)\)/)
  if (!matches) return
  let [_, icon, name, path] = matches
  let id = path.split('/modules/')[1]
  return id
}
