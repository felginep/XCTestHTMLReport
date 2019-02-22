class Xchtmlreport < Formula
  desc "XCTestHTMLReport: Xcode-like HTML report for Unit and UI Tests"
  homepage "https://github.com/applidium/XCTestHTMLReport"
  url "https://github.com/applidium/XCTestHTMLReport/archive/1.7.3.tar.gz"
  sha256 "1cff2878812c22a2b54071b941c406c2560c9eb7b10356bcafd01131bdaad23f"
  head "https://github.com/applidium/XCTestHTMLReport.git", :branch => "develop_ad"

  def install
    system "xcodebuild" " clean" " build" " CODE_SIGNING_REQUIRED=NO" " -workspace" " XCTestHTMLReport.xcworkspace" " -scheme XCTestHTMLReport" " -configuration Release"
    bin.install "xchtmlreport"
  end
end
