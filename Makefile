FILES = manifest.json content.js options.html options.js
all: clean zip
clean:
	-rm *.zip
zip:
	zip link-ntfy-notifier.zip $(FILES)
