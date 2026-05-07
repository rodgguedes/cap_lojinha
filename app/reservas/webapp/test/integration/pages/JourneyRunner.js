sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"reservas/test/integration/pages/EstoquesList",
	"reservas/test/integration/pages/EstoquesObjectPage"
], function (JourneyRunner, EstoquesList, EstoquesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('reservas') + '/test/flp.html#app-preview',
        pages: {
			onTheEstoquesList: EstoquesList,
			onTheEstoquesObjectPage: EstoquesObjectPage
        },
        async: true
    });

    return runner;
});

