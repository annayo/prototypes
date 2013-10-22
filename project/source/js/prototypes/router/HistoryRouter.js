define(function (require, exports, module) {

	"use strict";

	var HistoryRouter = require("libs/rosy-routing/HistoryRouter");
	var $ = require("$");

	return HistoryRouter.extend({

		init : function () {
			this.sup([], {
				usePushState : true
			});

			this.setRoutes();
			this.update();

			this.hijack($("#container"), 'a[href^="/"], [data-route], a[href^="#"]', "click");
		},

		setRoutes : function () {
			this.addRoute([
				"/",
				"/index.html"
			], require("../views/Home"), {
				selector: "#main"
			});

			this.addRoute("/about.html", require("../views/About"), {
				selector: "#main"
			});
		},

		destroy : function () {

		}
	});
});
