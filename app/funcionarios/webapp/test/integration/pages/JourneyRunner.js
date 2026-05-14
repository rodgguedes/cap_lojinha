sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sap/fe/demo/funcionarios/funcionarios/test/integration/pages/FuncionariosList",
	"sap/fe/demo/funcionarios/funcionarios/test/integration/pages/FuncionariosObjectPage"
], function (JourneyRunner, FuncionariosList, FuncionariosObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sap/fe/demo/funcionarios/funcionarios') + '/test/flp.html#app-preview',
        pages: {
			onTheFuncionariosList: FuncionariosList,
			onTheFuncionariosObjectPage: FuncionariosObjectPage
        },
        async: true
    });

    return runner;
});

