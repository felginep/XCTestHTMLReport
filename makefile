xchtmlreport:
	swift build -c release
	mv .build/release/xchtmlreport /usr/local/bin/