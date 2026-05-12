using {my.lojinha.estoque as es} from '../db/schema';

@path: 'Estoque'
service Estoque {

    entity Estoques as projection on es.Estoque;

    @readonly
    entity Reservas as projection on es.Reservas;
}