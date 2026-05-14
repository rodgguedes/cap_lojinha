using DadosMestres as service from '../../srv/dadosMestres';
annotate service.Materiais with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Codigo',
                Value : codigo,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Descrição',
                Value : descricao,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Unidade',
                Value : unidade,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Preço Base',
                Value : precoBase,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Ativo',
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
            Label : '{@i18n>table.codigo}',
            Value : codigo,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.descricao}',
            Value : descricao,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.unidade}',
            Value : unidade,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.precoBase}',
            Value : precoBase,
        },
        {
            $Type : 'UI.DataField',
            Label : '{@i18n>table.ativo}',
            Value : ativo,
        },
    ],
    UI.SelectionFields : [
        codigo,
        descricao,
        unidade,
        ativo,
    ],
);

annotate service.Materiais with {
    codigo @Common.Label : 'Codigo';
    descricao @Common.Label : 'Descricao';
    unidade @Common.Label : 'Unidade';
    ativo @Common.Label : 'Ativo';
};


