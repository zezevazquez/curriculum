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
    [].concat(
      Object.values(digest.phases),
      Object.values(digest.challenges),
      Object.values(digest.skills),
      Object.values(digest.modules),
    )
    .forEach(x => { delete x.READMEMarkdown })

    return digest
  })

  .then(digest => {
    const skills = [];

    [].concat(
      Object.values(digest.modules),
      Object.values(digest.challenges),
    ).map(x => {
      x.skills.forEach(skill => {
        if (!skills.includes(skill))
          skills.push(skill)
      })
    })

    digest._skills = skills.sort().map(name => ({
      name,
      id: nameToId(name),
    }))

    return digest
  })

  // Promise.all([
  //   loadChallenges(),
  //   loadModules(),
  //   loadPhases(),
  //   loadSkills(),
  // ])
  // .then(results => {

  //   const [
  //     challenges,
  //     modules,
  //     phases,
  //     skills,
  //   ] = results
  //   return {
  //     challenges,
  //     modules,
  //     phases,
  //     skills,
  //   }
  // })
  // // .then(([modules, phases]) => ({modules, phases}))
  // // .then(digest => {
  // //   digest.skillContexts = [
  // //     'Bash',
  // //     'Browser',
  // //     'Chrome Developer Tools',
  // //     'Compensation',
  // //     'CSS',
  // //     'Editor',
  // //     'Encryption',
  // //     'Express',
  // //     'General Programming',
  // //     'Git',
  // //     'GitHub',
  // //     'Google',
  // //     'Heroku',
  // //     'Hiring',
  // //     'HTML & CSS',
  // //     'HTML',
  // //     'HTTP',
  // //     'Interviews',
  // //     'JavaScript',
  // //     'Jobs',
  // //     'LinkedIn',
  // //     'Networking',
  // //     'Node',
  // //     'Regular Expression',
  // //     'shell',
  // //     'Slack',
  // //     'SQL',
  // //     'System Design',
  // //     'Terminal',
  // //     'tests',
  // //     'UNIX',
  // //     'postgresql',
  // //   ].sort()
  // //   return digest
  // // })
  // // .then(loadSkills)
  // // .then(generateReport)
