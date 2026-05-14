sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'sap.fe.demo.funcionarios.funcionarios',
            componentId: 'FuncionariosList',
            contextPath: '/Funcionarios'
        },
        CustomPageDefinitions
    );
});