const cds = require('@sap/cds')

module.exports = class DadosTransacionais extends cds.ApplicationService {
  init() {

    const { Pedidos, ItensPedido } = cds.entities('DadosTransacionais')

    this.before(['CREATE', 'UPDATE'], Pedidos, async (req) => {
      console.log('Before CREATE/UPDATE Pedidos', req.data)
    })
    this.after('READ', Pedidos, async (pedidos, req) => {
      console.log('After READ Pedidos', pedidos)
    })
    this.before(['CREATE', 'UPDATE'], ItensPedido, async (req) => {
      console.log('Before CREATE/UPDATE ItensPedido', req.data)
    })
    this.after('READ', ItensPedido, async (itensPedido, req) => {
      console.log('After READ ItensPedido', itensPedido)
    })

    // ─────────────────────────────────────────────
    // ACTION: confirmarPedido
    // ─────────────────────────────────────────────
    this.on('confirmarPedido', async (req) => {
      const { pedidoId, funcionarioId } = req.data

      const { PedidoHeader: Pedidos, PedidoItem: ItensPedido } = cds.entities('my.lojinha.dados_transacionais')
      const { Estoque: Estoques } = cds.entities('my.lojinha.estoque')
      const { Log } = cds.entities('my.lojinha.utilitarios')

      const oPedido = await SELECT.one.from(Pedidos).where({ ID: pedidoId })

      if (!oPedido)
        return req.error(404, cds.i18n.messages.at('PEDIDO_NOT_FOUND', pedidoId))

      if (oPedido.status !== 'ABERTO')
        return req.error(409, cds.i18n.messages.at('PEDIDO_STATUS_INVALIDO', oPedido.status))

      const aItens = await SELECT.from(ItensPedido).where({ pedido_ID: pedidoId })

      if (!aItens.length)
        return req.error(422, cds.i18n.messages.at('PEDIDO_SEM_ITENS', pedidoId))

      for (const oItem of aItens) {
        const oEstoque = await SELECT.one.from(Estoques)
          .where({ material_ID: oItem.material_ID, local_ID: oItem.local_ID })

        if (!oEstoque || oEstoque.saldo < oItem.quantidade)
          return req.error(422, cds.i18n.messages.at('ESTOQUE_INSUFICIENTE', oItem.material_ID))

        await UPDATE(Estoques)
          .set({ saldo: oEstoque.saldo - oItem.quantidade })
          .where({ material_ID: oItem.material_ID, local_ID: oItem.local_ID })
      }

      const sNumeroPedido = `PED-${Date.now()}`

      await UPDATE(Pedidos)
        .set({ status: 'APROVADO', numero: sNumeroPedido, funcionario_ID: funcionarioId })
        .where({ ID: pedidoId })

      await INSERT.into(Log).entries({
        entidade: `PedidoHeader:${pedidoId}`,
        campo: 'status',
        valorAntigo: 'ABERTO',
        valorNovo: 'APROVADO'
      })

      return {
        sucesso: true,
        mensagem: 'Pedido aprovado com sucesso!',
        numeroPedido: sNumeroPedido
      }
    })

    return super.init()
  }
}
