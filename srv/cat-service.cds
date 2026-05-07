using {my.lojinha.dados_mestres as dm} from '../db/schema';
using {my.lojinha.dados_transacionais as dt} from '../db/schema';
using {my.lojinha.estoque as es} from '../db/schema';

@path: 'DadosMestres'
service DadosMestres {

    /** Dados mestres */
    entity Materiais    as projection on dm.Material;
    entity Funcionarios as projection on dm.Funcionario;

}

@path: 'DadosTransacionais'
service DadosTransacionais {

    /** Transacionais */
    entity Pedidos     as projection on dt.PedidoHeader;

    entity ItensPedido as projection on dt.PedidoItem;
}

@path: 'Estoque'
service Estoque {

    /** Estoque */
    entity Estoques as projection on es.Estoque;

    @readonly
    entity Reservas as projection on es.Reservas;
}