const cds = require('@sap/cds')

module.exports = class Estoque extends cds.ApplicationService { init() {

  const { Estoques, Reservas } = cds.entities('Estoque')

  this.before (['CREATE', 'UPDATE'], Estoques, async (req) => {
    console.log('Before CREATE/UPDATE Estoques', req.data)
  })
  this.after ('READ', Estoques, async (estoques, req) => {
    console.log('After READ Estoques', estoques)
  })
  this.before (['CREATE', 'UPDATE'], Reservas, async (req) => {
    console.log('Before CREATE/UPDATE Reservas', req.data)
  })
  this.after ('READ', Reservas, async (reservas, req) => {
    console.log('After READ Reservas', reservas)
  })


  return super.init()
}}
