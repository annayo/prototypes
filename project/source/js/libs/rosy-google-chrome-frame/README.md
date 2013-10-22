### Using the Google Chrome Frame module

1. Require ChromeFrame.js in your index file. For best results, wrap in an IE conditional (Note that Rosy includes a pre-defined shortcut to the ChromeFrame module. You'll need to specify the path if you've removed the shortcut):

```html
	<!--[if lte IE 9]>
	<script>
		require(["ChromeFrame"]);
	</script>
	<![endif]-->
```

2. (Optional) If you're using [Caboose](https://github.com/ff0000/caboose), require the Caboose module from your `ie.scss` stylesheet.

```scss
@import "rosy/modules/google-chrome-frame/chrome-frame";
```
