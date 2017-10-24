const queries = require('../../database/queries')
const commands = require('../../database/commands')
const bodyParser = require('body-parser')
const { createUserReviews, authorizeDelete, getModuleFeedBack } = require('./helpers')
const { IDMClient } = require('../../backoffice/idm/index')
const methodOverride = require('method-override')

module.exports = app => {

  app.get('/modules', app.ensureTrailingSlash, (request, response, next) => {
    response.renderMarkdownFile(`/modules/README.md`)
  })

  app.get('/modules/:moduleName', app.ensureTrailingSlash)

  app.use('/modules/:moduleName', (request, response, next) => {
    const userId = request.user.id
    const { moduleName } = request.params
    const { digest } = response
    const { renderSkill } = app.locals
    const currentModule = digest.modules[moduleName]
    const currentModuleSkills = currentModule.skills
      .map(id => {
        const skill = digest.skills[id]
        const html = renderSkill(skill)
        return {id, html, path: skill.path}
      })

    response.locals.moduleName = moduleName
    response.locals.currentModule = currentModule
    response.locals.currentModuleSkills = currentModuleSkills

    const labels = currentModuleSkills.map(skill => skill.id)
    queries.getChecksForUserAndLabels({userId, labels})
      .then(checks => {
        currentModuleSkills.forEach(skill => {
          skill.checked = !!checks[skill.id]
        })
        next()
      })
      .catch(next)
  })

  app.get('/modules/:moduleName', (request, response, next) => {
    const { moduleName } = request.params
    response.renderMarkdownFile(`/modules/${moduleName}/README.md`)
  })

  const feedbackParser = bodyParser.urlencoded({extended: true})
  app.use(bodyParser.json())

  app.use(methodOverride('_method'))

  app.route('/modules/:moduleName/feedback')
      .get((request, response, next) => {
        const { moduleName } = request.params
        const IDM = new IDMClient(request.cookies.lgJWT)
        const moduleFeedback = { allUsers : [], allReviews: [], userReviews: [] }
        IDM.getAllUsers()
          .then(users => {
            moduleFeedback.allUsers = users
            return queries.getAllModuleFeedback(response.locals.currentModule.name)
          })
          .then(feedback => {
            moduleFeedback.allReviews = feedback
            response.render('module_feedback', { moduleName, reviews: createUserReviews(moduleFeedback, request)})
          })
      })
      .post(feedbackParser, (request, response, next) => {
        commands.addModuleFeedback(
          response.locals.currentUser.id,
          response.locals.currentUser.handle,
          response.locals.currentModule.name,
          request.body.feedback
        )
        .then(() => response.redirect(`/modules/${request.params.moduleName}`))
      })

  app.use(authorizeDelete)

  app.delete('/modules/:moduleName/feedback/:id',(request, response, next) => {
    commands.deleteModuleFeedback(request.params.id)
    .then(() => response.redirect(`/modules/${request.params.moduleName}/feedback`))
  })

  app.get('/modules/:moduleName/*', (request, response, next) => {
    response.renderFile(request.path)
  })

}
