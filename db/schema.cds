namespace my.lojinha;

using {
    cuid,
    managed
} from '@sap/cds/common';

context enums {
    type UnidadeMedida : String enum {
        UN = 'UN'; // Unidade
        KG = 'KG'; // Quilograma
        G = 'G'; // Grama
        L = 'L'; // Litro
        ML = 'ML'; // Mililitro
        CX = 'CX'; // Caixa
        PC = 'PC'; // Pacote
    };

    type StatusPedido  : String enum {
        ABERTO = 'ABERTO';
        APROVADO = 'APROVADO';
        FATURADO = 'FATURADO';
        CANCELADO = 'CANCELADO';
    };
}

context dados_mestres {

    entity Material : cuid, managed {
        codigo    : String(40);
        descricao : String(255);
        unidade   : enums.UnidadeMedida;
        precoBase : Decimal(15, 2);
        ativo     : Boolean default true;
    }

    entity Funcionario : cuid, managed {
        matricula : String(20);
        nome      : String(120);
        email     : String(120);
        ativo     : Boolean default true;
    }
}

context dados_transacionais {

    entity PedidoHeader : cuid, managed {
        numero      : String(30);
        dataPedido  : Date;
        status      : enums.StatusPedido default 'ABERTO';

        funcionario : Association to dados_mestres.Funcionario;

        itens       : Composition of many PedidoItem
                          on itens.pedido = $self;

        totalBruto  : Decimal(15, 2);
    }

    entity PedidoItem : managed {
        key pedido     : Association to PedidoHeader;
        key item       : Integer;

            material   : Association to dados_mestres.Material;

            quantidade : Decimal(15, 3);
            precoUnit  : Decimal(15, 2);
            valorItem  : Decimal(15, 2);
    }
}

context estoque {

    entity Estoque : managed {
        key material  : Association to dados_mestres.Material;
        key local     : String(60);

            saldo     : Decimal(15, 3) default 0;
            reservado : Decimal(15, 3) default 0;
    }
}
