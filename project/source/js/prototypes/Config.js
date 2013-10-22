define(

	[
		"rosy/base/Model"
	],

	function (Model) {

		"use strict";

		var Config = Model.extend({
			defaults : {
				"STATIC_URL" : ""
			}
		});

		return new Config();
	}
);
