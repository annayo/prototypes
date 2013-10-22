define(

	[
		"libs/rosy-routing/View",
		"$"
	],

	function (View, $) {

		"use strict";

		var $body = $("body");

		return View.extend({

			$content : "",

			init : function () {},

			load : function () {

				var selector = this.config.selector,
					$selector = $(selector),
					pageData;

				if (this.data.route) {

					$.ajax(this.data.route).done(this.proxy(function (data) {

						data = $("<div/>").append(data);

						this.$content = $(data).find(selector);
						this.$content.css("opacity", "0");

						pageData = this.$content.data();

						$selector.replaceWith(this.$content);

						$body.removeAttr("class");
						$body.addClass(pageData.bodyClass);

						this.updateTitle(pageData.title || $(data).find("title").text());

						this.loadComplete();
					}));
				} else {
					this.$content = $selector;
					this.loadComplete();
				}
			},

			transitionIn : function () {
				this.$content.animate({
					opacity : 1
				}, 500, this.transitionInComplete);
			},

			transitionOut : function () {
				this.$content.animate({
					opacity : 0
				}, 500, this.transitionOutComplete);
			},

			destroy : function () {
				this.$content = null;
			}
		});
	}
);
