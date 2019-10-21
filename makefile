xchtmlreport:
	swift build -c release
	mv .build/release/xchtmlreport /usr/local/bin/

templates:
	./create_templates.rb

build: templates
	swift build

project: templates
	swift package generate-xcodeproj