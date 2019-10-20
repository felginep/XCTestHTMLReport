//
//  DesignReview.swift
//  Rainbow
//
//  Created by Pierre Felgines on 18/10/2019.
//

import Foundation

struct DesignReview: HTML
{
    private let attachments: [Attachment]

    init(summary: TestSummary) {
        self.attachments = summary.tests
            .flatMap { $0.allSubTests }
            .flatMap { $0.activities }
            .flatMap { $0.attachments }
            .filter { $0.type == .png || $0.type == .jpeg }
    }

    // PRAGMA MARK: - HTML

    var htmlTemplate = HTMLTemplates.testDesignReview

    var htmlPlaceholderValues: [String: String] {
        return [
            "UUID": NSUUID().uuidString,
            "DESIGN_REVIEW_SCREENSHOTS": attachments
                .map(DesignReviewScreenshot.init)
                .map { $0.html }
                .joined()
        ]
    }
}
