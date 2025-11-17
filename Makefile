FILES = manifest.json content.js options.html options.js
clean:
	rm *.zip
zip:
	zip link-ntfy-notifier.zip $(FILES)
