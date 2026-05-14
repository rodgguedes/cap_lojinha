using DadosMestres as service from '../../srv/dadosMestres';
annotate service.Funcionarios with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'matricula',
                Value : matricula,
            },
            {
                $Type : 'UI.DataField',
                Label : 'nome',
                Value : nome,
            },
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ativo',
                Value : ativo,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.matricula}',
            Value : matricula,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.nome}',
            Value : nome,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.email}',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.ativo}',
            Value : ativo,
        },
    ],
    UI.SelectionFields : [
        matricula,
        nome,
        email,
        ativo
    ],
);

annotate service.Funcionarios with {
    matricula @Common.Label : '{@i18n>table.matricula}';
    nome @Common.Label : '{@i18n>table.nome}';
    email @Common.Label : '{@i18n>table.email}';
    ativo @Common.Label : '{@i18n>table.ativo}';
};


