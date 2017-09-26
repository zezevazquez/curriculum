const {
  readDirectoriesWithREADMEs,
  extractSkillsFromREADMEMarkdowns,
  mapToObjectBy,
} = require('./utils')

module.exports = () =>
  readDirectoriesWithREADMEs('/modules')
  .then(extractSkillsFromREADMEMarkdowns)
  .then(mapToObjectBy('id'))


// const extractModuleDetails = modules =>
//   Promise.all(
//     modules.map(module =>
//       utils.readMarkdownFile(module.path+'/README.md')
//         .then(document => {
//           module.skills = extractListFromSection(document, 'Skills', 2)
//             .map(skill => skill.trim())
//           return module
//         })
//     )
//   )

//   loadModuleDirectoryNames()
//     .then(convertModuleDirectoryNamesToModules)
//     .then(extractModuleDetails)
//     .then(indexById)

// const loadModuleDirectoryNames = () =>
//   utils.readdir('/modules')

// const convertModuleDirectoryNamesToModules = moduleDirectoryNames =>
//   moduleDirectoryNames
//     .filter(noExtension)
//     .sort()
//     .map(directoryName => ({
//       directoryName,
//       id: directoryName,
//       name: directoryName.replace(/-/g, ' '),
//       path: `/modules/${encodeURIComponent(directoryName)}`,
//     }))

// const extractModuleDetails = modules =>
//   Promise.all(
//     modules.map(module =>
//       utils.readMarkdownFile(module.path+'/README.md')
//         .then(document => {
//           module.skills = utils.extractListFromSection(document, 'Skills', 2)
//             .map(skill => skill.trim())
//           return module
//         })
//     )
//   )

// const indexById = modules => {
//   return modules.reduce((index, module) => {
//     index[module.id] = module
//     return index
//   }, {})
// }

// const noExtension = module => !module.includes('.')
