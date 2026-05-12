const cds = require('@sap/cds')

module.exports = class DadosMestres extends cds.ApplicationService {
  async init() {

    const { Materiais } = this.entities

    function _getEnumValues(sFullyQualifiedEnumType) {
      const oType = cds.model?.definitions?.[sFullyQualifiedEnumType]
      if (!oType?.enum) return []
      return Object.keys(oType.enum)
    }

    let aUnidadesPermitidas = null
    const _getUnidades = () => {
      if (!aUnidadesPermitidas) {
        aUnidadesPermitidas = _getEnumValues('my.lojinha.enums.UnidadeMedida')
      }
      return aUnidadesPermitidas
    }

    // ─────────────────────────────────────────────
    // BEFORE CREATE (Material)
    // ─────────────────────────────────────────────
    this.before('CREATE', Materiais, async (req) => {
      const oData = req.data

      if (!oData.codigo || !String(oData.codigo).trim())
        return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_CODE'))

      if (!oData.descricao || !String(oData.descricao).trim())
        return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_DESCRIPTION'))

      if (!oData.unidade || !String(oData.unidade).trim())
        return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_UNIT'))

      oData.unidade = String(oData.unidade).trim().toUpperCase()

      const aUnidades = _getUnidades()
      if (!aUnidades.includes(oData.unidade))
        return req.error(400, cds.i18n.messages.at('INVALID_MATERIAL_UNIT', oData.unidade, aUnidades.join(', ')))

      oData.codigo    = String(oData.codigo).trim().toUpperCase()
      oData.descricao = String(oData.descricao).trim()

      if (oData.precoBase !== undefined && oData.precoBase !== null) {
        const nPreco = Number(oData.precoBase)
        if (Number.isNaN(nPreco) || nPreco < 0)
          return req.error(400, cds.i18n.messages.at('INVALID_MATERIAL_PRICE'))
      }

      const oJaExiste = await SELECT.one.from(Materiais).where({ codigo: oData.codigo })
      if (oJaExiste)
        return req.error(400, cds.i18n.messages.at('DUPLICATE_MATERIAL_CODE', oData.codigo))
    })

    // ─────────────────────────────────────────────
    // BEFORE UPDATE (Material)
    // ─────────────────────────────────────────────
    this.before('UPDATE', Materiais, async (req) => {
      const oData = req.data

      const sId = req.params?.[0]?.ID ?? req.data.ID

      if (oData.codigo !== undefined) {
        oData.codigo = String(oData.codigo).trim().toUpperCase()

        const oJaExiste = await SELECT.one.from(Materiais)
          .where({ codigo: oData.codigo, ID: { '!=': sId } })

        if (oJaExiste)
          return req.error(400, cds.i18n.messages.at('DUPLICATE_MATERIAL_CODE', oData.codigo))
      }

      if (oData.descricao !== undefined && oData.descricao !== null) {
        oData.descricao = String(oData.descricao).trim()
        if (!oData.descricao)
          return req.error(400, cds.i18n.messages.at('EMPTY_MATERIAL_DESCRIPTION'))
      }

      if (oData.precoBase !== undefined && oData.precoBase !== null) {
        const nPreco = Number(oData.precoBase)
        if (Number.isNaN(nPreco) || nPreco < 0)
          return req.error(400, cds.i18n.messages.at('INVALID_MATERIAL_PRICE'))
      }

      req._estadoAnterior = await SELECT.one.from(Materiais).where({ ID: sId })
    })

    // ─────────────────────────────────────────────
    // AFTER UPDATE (Material)
    // ─────────────────────────────────────────────
    this.after('UPDATE', Materiais, async (data, req) => {
      const { Log } = cds.entities('my.lojinha.utilitarios')

      const oAntes = req._estadoAnterior ?? {}
      const aCamposAlterados = Object.keys(req.data).filter(s => s !== 'ID')

      if (!aCamposAlterados.length) return

      const aLogs = aCamposAlterados
        .filter(sCampo => String(oAntes[sCampo] ?? '') !== String(req.data[sCampo] ?? ''))
        .map(sCampo => ({
          entidade    : 'Material',
          campo       : sCampo,
          valorAntigo : String(oAntes[sCampo] ?? ''),
          valorNovo   : String(req.data[sCampo] ?? '')
        }))

      if (!aLogs.length) return

      await INSERT.into(Log).entries(aLogs)
    })

    return super.init()
  }
}