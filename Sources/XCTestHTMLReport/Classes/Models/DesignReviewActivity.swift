//
//  DesignReviewActivity.swift
//  XCTestHTMLReport
//
//  Created by Pierre Felgines on 21/10/2019.
//

import Foundation

struct DesignReviewActivity: HTML
{

    private let activity: Activity
    private let uuid: String

    init(activity: Activity) {
        self.activity = activity
        self.uuid = UUID().uuidString
    }

    // PRAGMA MARK: - HTML

    var htmlTemplate = HTMLTemplates.testDesignReviewActivity

    var htmlPlaceholderValues: [String: String] {
        return [
            "UUID": uuid,
            "NAME": activity.title,
            "DESIGN_REVIEW_SCREENSHOTS": activity
                .imageAttachments
                .map(DesignReviewScreenshot.init)
                .map { $0.html }
                .joined()
        ]
    }
}
