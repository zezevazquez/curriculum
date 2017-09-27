const {
  promiseMap,
  nameToId,
} = require('./utils')
const loadChallenges = require('./challenges')
const loadModules = require('./modules')
const loadPhases = require('./phases')
const loadSkills = require('./skills')
const skillContexts = require('./skillContexts')
const generateReport = require('./report')

module.exports = () =>
  promiseMap({
    skillContexts,
    challenges: loadChallenges(),
    modules: loadModules(),
    phases: loadPhases(),
    skills: loadSkills(),
  })
  .then(digest => {
    // do any phases link to any missing challenges?
    // do any challenges or modules reference any missing skills?
  })
  // .then(digest => {
  //   const skills = [];

  //   [].concat(
  //     Object.values(digest.modules),
  //     Object.values(digest.challenges),
  //   ).map(x => {
  //     x.skills.forEach(skill => {
  //       if (!skills.includes(skill))
  //         skills.push(skill)
  //     })
  //   })

  //   digest._skills = skills.sort().map(name => ({
  //     name,
  //     id: nameToId(name),
  //   }))

  //   return digest
  // })
