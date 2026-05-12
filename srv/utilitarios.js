const cds = require('@sap/cds')

module.exports = class Utilitarios extends cds.ApplicationService { init() {

  const { Log } = cds.entities('Utilitarios')

  this.before (['CREATE', 'UPDATE'], Log, async (req) => {
    console.log('Before CREATE/UPDATE Log', req.data)
  })
  this.after ('READ', Log, async (log, req) => {
    console.log('After READ Log', log)
  })


  return super.init()
}}
