using {my.lojinha.utilitarios as ut} from '../db/schema';

@path: 'Utilitarios'
service Utilitarios {
    @readonly
    entity Log as projection on ut.Log;
}