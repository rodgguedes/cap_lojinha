using {my.lojinha.dados_mestres as dm} from '../db/schema';

@path: 'DadosMestres'
service DadosMestres {

    entity Materiais    as projection on dm.Material;
    entity Funcionarios as projection on dm.Funcionario;
}