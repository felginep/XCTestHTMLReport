class Xchtmlreport < Formula
  desc "XCTestHTMLReport: Xcode-like HTML report for Unit and UI Tests"
  homepage "https://github.com/applidium/XCTestHTMLReport"
  url "https://github.com/applidium/XCTestHTMLReport/archive/2.0.1.tar.gz"
  sha256 "99ce892200ac116ee551ab609045983070165b706cac08391f294c979ceab448"
  head "https://github.com/applidium/XCTestHTMLReport.git", :branch => "develop_ad"

  def install
    system "swift build --disable-sandbox -c release"
    bin.install ".build/release/xchtmlreport"
  end
end
