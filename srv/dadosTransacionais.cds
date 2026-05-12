using {my.lojinha.dados_transacionais as dt} from '../db/schema';

@path: 'DadosTransacionais'
service DadosTransacionais {

    entity Pedidos     as projection on dt.PedidoHeader;

    entity ItensPedido as projection on dt.PedidoItem;

    action confirmarPedido(
        pedidoId     : UUID,
        funcionarioId: UUID
    ) returns {
        sucesso      : Boolean;
        mensagem     : String;
        numeroPedido : String;
    };
}