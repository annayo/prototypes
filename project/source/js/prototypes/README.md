example
=======

Example project for Rosy

`index.html`

```html
<!doctype html>
	<head>
		<title>Home</title>
	</head>
	<body class="home">
		<div id="container">
			<header>
				<nav role="navigation">
					<ul>
						<li><a href="/index.html">Home</a></li>
						<li><a href="/about.html">About</a></li>
					</ul>
				</nav>
			</header>
			<div id="main" role="main">
				Home page
			</div>
			<footer>
			</footer>
		</div>

		<!--// Requirejs.org //-->
		<script src="libs/requirejs/require.js"></script>

		<!--// Let Rosy configure require //-->
		<script src="libs/rosy/config.js"></script>

		<!--// Unminified Development Version //-->
		<script>
			require.config({
				baseUrl : "/", // tell require where all the javascript lives
				urlArgs : "cacheBust=" + (new Date()).getTime()
			});

			require(["libs/example/Site"], function (Site) {
				Site.initialize({
					"STATIC_URL" : "/"
				});
			});
		</script>


		<!--[if lte IE 9]>
		<script>
			require(["rosy-google-chrome-frame/ChromeFrame"]);
		</script>
		<![endif]-->
	</body>
</html>
```


