class Xchtmlreport < Formula
  desc "XCTestHTMLReport: Xcode-like HTML report for Unit and UI Tests"
  homepage "https://github.com/applidium/XCTestHTMLReport"
  url "https://github.com/applidium/XCTestHTMLReport/archive/2.0.0.tar.gz"
  sha256 "1cff2878812c22a2b54071b941c406c2560c9eb7b10356bcafd01131bdaad23f"
  head "https://github.com/applidium/XCTestHTMLReport.git", :branch => "develop_ad"

  def install
    system "swift build -c release"
    bin.install ".build/release/xchtmlreport"
  end
end
