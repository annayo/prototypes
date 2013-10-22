define(
	[
		"rosy/modules/Module",
		"$"
	],

	function (Module, $) {

		"use strict";

		var ERROR_LOG = [];

		return Module.extend({

			$el : null,

			url : null,

			modules: {},

			validators : {
				required : {
					message : "This field is required",
					validate : function (str) {
						var pattern = /\S/;
						return pattern.test(str);
					}
				},
				checked : {
					message : "Please select one",
					validate : function (name) {
						return this.$el.find("[name=" + name + "]:checked").length > 0
					}
				},
				password : {
					message : "Password must contain uppercase, lowercase, and a number",
					validate : function (str) {
						var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
						return pattern.test(str);
					}
				},
				matches : {
					message : "Values do not match",
					validate : function (val1, val2) {
						console.log(val1, val2)
						return val1 === val2;
					}
				},
				alpha : {
					message : "Please enter only alpha characters",
					validate : function (str) {
						var pattern = /^[a-zA-Z]*$/;
						return pattern.test(str.replace(/\s/g, ""));
					}
				},
				zip : {
					message : "Please enter a 5-digit zip code",
					validate : function (zipcode) {
						var pattern = /^\d{5}$|^\d{5}-\d{4}$/;
						return pattern.test(zipcode);
					}
				},
				digits : {
					message : "Please enter only digits",
					validate : function (value) {
						var pattern = /^[0-9]/;
						return pattern.test(value);
					}
				},
				email : {
					message : "Please enter a valid email address",
					validate : function (email) {
						var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
						return pattern.test(email);
					}
				},
				tel : {
					message : "Please enter a 10 digit phone number",
					validate : function (phone) {
						var digits = phone.replace(/[^0-9]/g, "");
						if ((digits.length === 10) && isNaN(digits) === false) {
							return true;
						} else {
							return false;
						}
					}
				}
			},

			init : function (settings) {
				this.$el = settings.$el;
				this.url = this.$el.attr("action");

				this.addListeners();
			},

			addListeners : function () {
				var self = this;
				this.$el
					.on("submit", this.validateAll)
					.on("click", ".btn-link", this.clearAll)
					.on("blur", "[required], [pattern]", this.validateField)
					.on("keyup", ".alert [required]", this.validateField);

				this.on("error", this.addError);
				this.on("update", this.removeError);
				this.on("success:validate", this.onValid);
				this.on("success:submit", this.onSendSuccess);
				this.on("error:submit", this.onSendFail);
			},

			clearAll : function () {
				//TODO: clear all values and messaging
				return;
			},

			validateAll : function (e) {
				e.preventDefault();

				var self = this;

				//TODO: store validation fields and validators on init
				this.$el.find("[required], [pattern]").each(function () {
					self.validateField(this);
				});

				if (ERROR_LOG.length === 0) {
					this.trigger("success:validate");
				} else {
					//TODO: display all errors with jump link to field
					console.log(ERROR_LOG)
				}
			},

			validateField : function (field) {
				// if $field came from blur event, set to $(e.currentTarget)
				var $field = (field.currentTarget !== undefined) ? $(field.currentTarget) : $(field);

				if ($field.is(":checkbox") || $field.is(":radio")) {
					this.validateFieldset(field);
					return;
				}

				var validators = this.createValidatorsArray($field),
					validatorsCount = validators.length,
					value = [$field.val()];

				for (var i = 0; i < validatorsCount; i++) {
					var validator = validators[i];

					// add field value for match
					if (validator === "match") {
						value.push(this.$el.find("[name=" + $field.attr("name").slice(6) + "]").val());
					}

					// if validation passes, remove error
					if (this.validators[validator].validate.apply(this, value)) {
						this.removeError($field);
					} else {
						this.addError($field, this.validators[validator].message);
						return;
					}
				}
			},

			validateFieldset : function (field) {
				var $field = $(field),
					name = $field.attr("name");

				if (this.$el.find("[name=" + name + "]:checked").length > 0) {
					this.removeError($field);
				} else {
					this.addError($field, this.validators["required"].message);
				}
			},

			createValidatorsArray : function ($field) {
				var validators = [];

				if ($field.attr("required") !== undefined) {
					validators.push("required");
				}

				if ($field.attr("pattern") !== undefined) {
					validators.push($field.attr("pattern"));
				}

				return validators;
			},

			addError : function ($field, message) {
				var errorIndex = $.inArray($field[0], ERROR_LOG);

				// add error to log if not present
				if (errorIndex === -1) {
					ERROR_LOG.push($field[0]);
					this.toggleTooltip($field, message);
				}
			},

			removeError : function ($field) {
				var errorIndex = $.inArray($field[0], ERROR_LOG);

				// remove error from log if present
				if (errorIndex > -1) {
					ERROR_LOG.splice(errorIndex, 1);
					this.toggleTooltip($field);
				}
			},

			toggleTooltip : function ($field, message) {
				var $container = ($field.parents("label").length === 0) ? $field : $field.parents("label"),
					$tooltip = $container.find(".tooltip"),
					html = "<span>" + message + "</span>";

				if (message !== undefined) {
					//TODO: does it need .alert AND .show? prbly no
					$container.addClass("alert");

					if ($tooltip.length === 0) {
						$tooltip = $("<span />", { "class": "tooltip" }).appendTo($container);
						$tooltip.offset(); // force layout reflow for css transition effectiveness
					}

					$tooltip.html(html).addClass("show");
				} else {
					$container.removeClass("error");
					$tooltip.removeClass("show");
				}
			},

			onValid : function () {
				var self = this,
					formObj = this.$el.serialize();

				$.ajax({
					'url': self.url,
					'type': 'GET',
					'data': formObj,
					'beforeSend': function () {
						self.trigger('before:submit');
					},
					'success': function (data) {
						self.trigger('success:submit', data);
					},
					'error': function (data) {
						self.trigger('error:submit', data);
					}
				});
			},

			onSendSuccess : function (e, data) {
				//TODO: provide success feedback to user

				this.close();
			},

			onSendFail : function () {
				//TODO: provide error feedback to user
			},

			close : function () {
				this.$el.unbind().on("submit", function () {
					return false;
				});
			}
		});
	}
);
