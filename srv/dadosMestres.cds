using {my.lojinha.dados_mestres as dm} from '../db/schema';

@path: 'DadosMestres'
service DadosMestres {


    @odata.draft.enabled: true
    entity Materiais    as projection on dm.Material{
       *
    };
    @odata.draft.enabled: true
    entity Funcionarios as projection on dm.Funcionario;
}