define(
	[
		"rosy/modules/Module",
		"$",
		"$plugin!libs/plugins/jquery.throttle-debounce"
	],

	function (Module, $) {

		"use strict";

		var $window = $(window);

		return Module.extend({

			defaults: {
				// panels shown per page
				inView: 1,
				// auto rotation
				auto: false,
				// animation speed
				speed: 400,
				// interval speed
				interval: 4000,
				isEndless: false
			},

			init : function (settings) {
				this.o = $.extend({}, this.defaults, settings);
				this.o.auto = (this.o.auto === true && this.totalItems > 1) ? true : false;

				this.$list = this.o.$el;
				this.totalItems = this.$list.find("li").length;
				this.isAnimating = false;
				this.currMoves = 0;

				this.render();
			},

			render : function () {
				this.$list.wrap("<div class='carousel'></div>");
				this.$el = this.$list.parent(".carousel").addClass("render");
				this.moveDistance = this.$list.find("li:first").outerWidth();

				this.setMargins();

				this.left = this.marginLeft;

				this.setBoundaries();
				this.resize();
				this.addListeners();
				this.injectControls();
			},

			addListeners : function () {
				this.$el
					.on("click touchend", ".controls:not(.disabled)", this.move)
					.on("move resize_", this.toggleControls);

				$(window).resize($.debounce(50, this.resize));

				//TODO: if mobile
				this.addTouchListeners();
			},

			addTouchListeners : function () {
				var self = this,
					maxTime = 1000, // allow movement if < 1000 ms (1 sec)
					maxDistance = 50,
					startX = 0,
					startTime = 0;

				this.$el
				.on("touchstart MSPointerDown", function (e) {
					e.preventDefault();
					startTime = e.timeStamp;
					startX = self.getX(e);
				})
				.on("touchend MSPointerUp", function (e) {
					startTime = 0;
					startX = 0;
				})
				.on("touchmove MSPointerMove", function (e) {
					e.preventDefault();

					var currentX = self.getX(e),
						currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX),
						// allow if movement < 1 sec
						currentTime = e.timeStamp;

					if (startTime !== 0 && currentTime - startTime < maxTime && currentDistance > maxDistance) {
						// swipe left
						if (currentX < startX && !self.isEnd) {
							setTimeout(function () {
								self.move(1);
							}, 100);
						}

						// swipe right
						if (currentX > startX && !self.isFront) {
							setTimeout(function () {
								self.move(-1);
							}, 100);
						}

						startTime = 0;
						startX = 0;
					}
				});
			},

			getX : function (e) {
                var oe = e.originalEvent;
                oe = oe && oe.touches && oe.touches[0] || oe;
                return oe.pageX;
            },

			injectControls : function () {
				var $controls = $("<span class='controls prev disabled icon icon-caret-left'></span><span class='controls next disabled icon icon-caret-right'></span>").appendTo(this.$el);

				if (this.totalItems > this.o.inView) {
					this.$el.find(".controls.next").removeClass("disabled");

					if (this.o.isEndless) {
						this.$el.find(".controls.prev").removeClass("disabled");
					}
				}
			},

			toggleControls : function () {
				var $controls = this.$el.find(".controls"),
					$controlsNext = this.$el.find(".controls.next"),
					$controlsPrev = this.$el.find(".controls.prev");

				switch (true) {
				case this.totalItems <= this.o.inView:
				case this.isFront && this.isEnd:
					$controls.addClass("disabled");
					break;
				case this.isFront:
					$controlsPrev.addClass("disabled");
					if (!this.isEnd) {
						$controlsNext.removeClass("disabled");
					}
					break;
				case this.isEnd:
					$controlsNext.addClass("disabled");
					if (!this.isFront) {
						$controlsPrev.removeClass("disabled");
					}
					break;
				default:
					$controls.removeClass("disabled");
					break;
				}
			},

			rotateOn : function () {
				if (this.o.auto) {
					this.intervalMove = setInterval(this.move, this.o.interval);
				}
			},

			rotateOff : function () {
				if (this.intervalMove !== undefined) {
					clearInterval(this.intervalMove);
					this.intervalMove = null;
				}
			},

			rotateReset : function () {
				this.rotateOff();
				setTimeout(this.rotateOn, 200);
			},

			setMargins : function () {
				this.marginRight = parseInt(this.$list.css("padding-right"), 10);
				this.marginLeft = parseInt(this.$list.css("left"), 10);
			},

			// event (e) fired from .controls
			move : function (e) {
				var self = this,
					$childSet = this.$list.children(),
					direction;

				// determine amount to move
				if (e.type === undefined) {
					direction = e;
				} else {
					var $target = $(e.currentTarget);
					direction = ($target.hasClass("prev")) ? -1 : 1;
				}

				// set and move to new left position
				if (!this.isAnimating && direction !== 0) {

					this.isAnimating = true;

					// prepend last item before animate
					if (this.o.isEndless && direction < 0) {
						$childSet.last().prependTo(self.$list);
						self.adjustScroll(direction);
					}

					this.left -= (direction * this.moveDistance);

					this.$list.animate({
						left: (this.left) + "px"
					}, self.o.speed, function () {
						self.isAnimating = false;

						// append first item after animate
						if (self.o.isEndless && direction > 0) {
							$childSet.first().appendTo(self.$list);
							self.adjustScroll(direction);
						}
					});

					// track current position
					this.currMoves += direction;

					if (!this.o.isEndless) {
						this.setBoundaries(direction);
					}

					this.$el.trigger("move");
					this.publish("carousel.move");
				}
			},

			resize : function () {
				var windowWidth = $window.width(),
					itemWidth = this.$el.outerWidth() - (this.marginLeft + this.marginRight);

				// TODO: add breakpoints to settings
				if (windowWidth > 1200) {
					this.o.inView = (this.totalItems > 3) ? 3 : this.totalItems;
					itemWidth = Math.ceil(itemWidth / this.o.inView);

				} else if (windowWidth > 800) {
					this.o.inView = (this.totalItems > 2) ? 2 : this.totalItems;
					itemWidth = Math.ceil(itemWidth / this.o.inView);

				} else {
					this.o.inView = 1;
				}

				this.moveDistance = itemWidth;

				if (!this.o.isEndless) {
					this.setLeft();
					this.$list.css("left", (this.left) + "px");
					this.setBoundaries();
				}

				this.$list.find("li").css("width", itemWidth + "px");

				this.$el.trigger("resize_");
			},

			setLeft : function () {
				this.maxLeft = -((this.moveDistance * (this.totalItems - this.o.inView)) - this.marginLeft);

				// stabilize left position
				if (this.isFront) {
					this.left = this.marginLeft;
				} else if (this.isEnd) {
					this.left = this.maxLeft;
				} else {
					this.left = -(this.moveDistance * this.currMoves) + this.marginLeft;
				}
			},

			setBoundaries : function (direction) {
				this.isEnd = !this.o.isEndless ? (this.left === this.maxLeft) : false;
				this.isFront = !this.o.isEndless ? (this.left === this.marginLeft) : false;
			},

			adjustScroll : function (direction) {
				var innerWidth = this.$el.width(),
					itemsWidth = (innerWidth) / this.inView;

				this.left = (direction > 0) ? this.left + this.moveDistance : this.left - this.moveDistance;
				this.$list.css({ 'left' : this.left });
			}
		});
	}
);