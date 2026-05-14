sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sap/fe/demo/materiais/test/integration/pages/MateriaisList",
	"sap/fe/demo/materiais/test/integration/pages/MateriaisObjectPage"
], function (JourneyRunner, MateriaisList, MateriaisObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sap/fe/demo/materiais') + '/test/flp.html#app-preview',
        pages: {
			onTheMateriaisList: MateriaisList,
			onTheMateriaisObjectPage: MateriaisObjectPage
        },
        async: true
    });

    return runner;
});

