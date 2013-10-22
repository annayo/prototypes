define(

	[
		"rosy/base/Class",
		"./router/HistoryRouter",
		"./Config",
		"$"
	],

	function (Class, Router, Config, $) {

		"use strict";

		var Site = Class.extend({

			historyRouter : null,

			initialized : false,

			initialize : function (siteSettings) {
				if (!this.initialized) {

					// Add site settings to Config
					Config.set(siteSettings);

					// Add Router
					this.historyRouter = new Router();

					// Set initialized to true
					this.initialized = true;
				}
			}
		});

		return new Site();
	}
);
