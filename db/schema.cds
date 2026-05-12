namespace my.lojinha;

using {
    cuid,
    managed
} from '@sap/cds/common';

context enums {
    type UnidadeMedida : String(2) enum {
        UN; 
        KG; 
        G; 
        L;
        ML;
        CX;
        PC;
    };

    type StatusPedido  : String(10) enum {
        ABERTO;
        APROVADO;
        FATURADO;
        CANCELADO;
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
    entity Locais : cuid, managed{
        local    : String(10);
        descricao: String(60);
        ativo    : Boolean default true;
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
            local      : Association to dados_mestres.Locais;
            quantidade : Decimal(15, 3);
            precoUnit  : Decimal(15, 2);
            valorItem  : Decimal(15, 2);
            percDescon : Decimal(3,2);
    }
}

context estoque {
    entity Estoque : managed {
        key material  : Association to dados_mestres.Material;
        key local     : Association to dados_mestres.Locais;
            saldo     : Decimal(15, 3) default 0;
    }

view Reservas as
  select from dados_transacionais.PedidoHeader as header
    inner join dados_transacionais.PedidoItem as item
      on item.pedido.ID = header.ID
    left join dados_mestres.Material as mat
      on item.material.ID = mat.ID
  {
    key item.local.local         as local,
    key item.material.codigo     as material,
        mat.descricao            as descricaoMaterial,
        sum(item.quantidade)     as quantidade : Decimal(15,3),
        mat.unidade              as unidadeMedida
  }
  where header.status = #APROVADO
  group by
    item.local.local,
    item.material.codigo,
    mat.descricao,       
    mat.unidade;      
}

context utilitarios {
    
    entity Log : cuid, managed {
        entidade: String;
        campo: String;
        valorAntigo: String;
        valorNovo: String;
    }

}