const cds = require('@sap/cds')

module.exports = class DadosMestres extends cds.ApplicationService {
  init() {

    const { Materiais, Funcionarios } = cds.entities('DadosMestres')

    function _getEnumValues(sFullyQualifiedEnumType) {
      const oType = cds.model?.definitions?.[sFullyQualifiedEnumType];

      if (!oType?.enum) return [];

      return Object.keys(oType.enum);
    }

    const aUnidadesPermitidas = _getEnumValues('my.lojinha.enums.UnidadeMedida');

    this.before('CREATE', Materiais, async (req) => {
      const oData = req.data;
      
      // 1) obrigatórios
      if (!oData.codigo || !String(oData.codigo).trim()) {
        return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_CODE'));
      }
      if (!oData.descricao || !String(oData.descricao).trim()) {
        return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_DESCRIPTION'));
      }
      if (!oData.unidade || !String(oData.unidade).trim()) {
        return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_UNIT'));
      }

      oData.unidade = String(oData.unidade).trim().toUpperCase();

      if (!aUnidadesPermitidas.includes(oData.unidade)) {
        return req.error(400, cds.i18n.messages.at('INVALID_MATERIAL_UNIT', oData.unidade, aUnidadesPermitidas.join(', ')));
      }

      oData.codigo = String(oData.codigo).trim().toUpperCase();
      oData.descricao = String(oData.descricao).trim();

      if (oData.precoBase !== undefined && oData.precoBase !== null) {
        const nPreco = Number(oData.precoBase);
        if (Number.isNaN(nPreco) || nPreco < 0) {
          return req.error(400, cds.i18n.messages.at('INVALID_MATERIAL_PRICE'));
        }
      }

      // 4) código único (verifica no banco)
      const oJaExiste = await SELECT.one.from(Materiais).where({ codigo: oData.codigo });
      if (oJaExiste) {
        return req.error(400, cds.i18n.messages.at("DUPLICATE_MATERIAL_CODE", oData.codigo));
      }

    });

    // =========================
    // BEFORE UPDATE (Material)
    // =========================
    this.before('UPDATE', Materiais, async (req) => {
      const oData = req.data;

      // Se permitir alterar código, normalize e garanta unicidade
      if (oData.codigo !== undefined) {
        oData.codigo = String(oData.codigo).trim().toUpperCase();

        const oJaExiste = await SELECT.one.from(Materiais)
          .where({ codigo: oData.codigo, ID: { '!=': req.data.ID } }); // evita bater nele mesmo

        if (oJaExiste) {
          return req.error(400, cds.i18n.messages.at("DUPLICATE_MATERIAL_CODE", oData.codigo));
        }
      }

      // Normaliza descrição se veio
      if (oData.descricao !== undefined && oData.descricao !== null) {
        oData.descricao = String(oData.descricao).trim();
        if (!oData.descricao) return req.error(400, cds.i18n.messages.at('MISSING_MATERIAL_DESCRIPTION'));
      }

      // preço
      if (oData.precoBase !== undefined && oData.precoBase !== null) {
        const nPreco = Number(oData.precoBase);
        if (Number.isNaN(nPreco) || nPreco < 0) {
          return req.error(400, cds.i18n.messages.at('INVALID_MATERIAL_PRICE'));
        }
      }
    });

    return super.init()
  }
}
