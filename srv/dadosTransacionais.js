const cds = require('@sap/cds')

module.exports = class DadosTransacionais extends cds.ApplicationService {
  async init() { // ✅ async que estava faltando

    const { Pedidos, ItensPedido } = this.entities // ✅ this.entities, não cds.entities('DadosTransacionais')

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
      const { Estoque: Estoques, Reservas }                    = cds.entities('my.lojinha.estoque')
      const { Log }                                            = cds.entities('my.lojinha.utilitarios')

      // 1. Valida existência e status do pedido
      const oPedido = await SELECT.one.from(Pedidos).where({ ID: pedidoId })

      if (!oPedido)
        return req.error(404, cds.i18n.messages.at('PEDIDO_NOT_FOUND', [pedidoId]))

      if (oPedido.status !== 'ABERTO')
        return req.error(409, cds.i18n.messages.at('PEDIDO_STATUS_INVALIDO', [oPedido.status]))

      // 2. Busca itens do pedido com os códigos de material e local (necessários para cruzar com Reservas)
      const aItens = await SELECT.from(ItensPedido)
        .columns('pedido_ID', 'item', 'quantidade', 'material_ID', 'local_ID',
                 'material.codigo as materialCodigo',
                 'local.local     as localCodigo')
        .where({ pedido_ID: pedidoId })

      if (!aItens.length)
        return req.error(422, cds.i18n.messages.at('PEDIDO_SEM_ITENS', [pedidoId]))

      // 3. Valida disponibilidade de cada item
      //    saldo disponível = Estoque.saldo − Reservas.quantidade (pedidos já APROVADOS)
      for (const oItem of aItens) {

        // Saldo físico no estoque
        const oEstoque = await SELECT.one
          .from(Estoques)
          .where({ material_ID: oItem.material_ID, local_ID: oItem.local_ID })

        if (!oEstoque)
          return req.error(422, cds.i18n.messages.at('ESTOQUE_INSUFICIENTE', [oItem.materialCodigo]))

        // Quantidade já reservada por outros pedidos APROVADOS
        // Reservas usa chave por código (String), não por UUID
        const oReserva = await SELECT.one
          .from(Reservas)
          .where({ material: oItem.materialCodigo, local: oItem.localCodigo })

        const nReservado   = oReserva?.quantidade ?? 0
        const nDisponivel  = oEstoque.saldo - nReservado

        if (nDisponivel < oItem.quantidade)
          return req.error(422, cds.i18n.messages.at('ESTOQUE_INSUFICIENTE', [oItem.materialCodigo]))
        
      }

      // 4. Aprova o pedido
      //    A partir daqui ele entra na view Reservas automaticamente,
      //    comprometendo o saldo para os próximos pedidos
      await UPDATE(Pedidos)
        .set  ({ status: 'APROVADO', funcionario_ID: funcionarioId })
        .where({ ID: pedidoId })

      // 5. Grava log
      await INSERT.into(Log).entries({
        entidade    : `PedidoHeader:${pedidoId}`,
        campo       : 'status',
        valorAntigo : 'ABERTO',
        valorNovo   : 'APROVADO'
      })

      return {
        sucesso      : true,
        mensagem     : cds.i18n.messages.at("PEDIDO_APROVADO"),
        numeroPedido : oPedido.numero
      }
    })

    return super.init()
  }
}