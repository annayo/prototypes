/**
 * Example Site initialization
 */
define(

	[
		"./Page",
		"../Config",
		"$",
		"../modules/Form"
	],

	function (Page, Config, $, Form) {

		"use strict";

		return Page.extend({

			$main : null,

			load : function () {
				this.sup();

				var formModule = new Form({ $el: $("form") });
			},

			loadComplete : function () {
				this.$main = $("#main");
				this.sup();
			},

			destroy : function () {
				this.$main = null;
				this.sup();
			}
		});
	}
);
