const cds = require('@sap/cds')

module.exports = class DadosMestres extends cds.ApplicationService { init() {

  const { Materiais, Funcionarios } = cds.entities('DadosMestres')

  this.before (['CREATE', 'UPDATE'], Materiais, async (req) => {
    console.log('Before CREATE/UPDATE Materiais', req.data)
  })
  this.after ('READ', Materiais, async (materiais, req) => {
    console.log('After READ Materiais', materiais)
  })
  this.before (['CREATE', 'UPDATE'], Funcionarios, async (req) => {
    console.log('Before CREATE/UPDATE Funcionarios', req.data)
  })
  this.after ('READ', Funcionarios, async (funcionarios, req) => {
    console.log('After READ Funcionarios', funcionarios)
  })

  return super.init()
}}
