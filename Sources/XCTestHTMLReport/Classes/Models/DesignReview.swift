//
//  DesignReview.swift
//  Rainbow
//
//  Created by Pierre Felgines on 18/10/2019.
//

import Foundation

struct DesignReview: HTML
{
    private let activities: [DesignReviewActivity]

    init(summary: TestSummary) {
        self.activities = summary.tests
            .flatMap { $0.allSubTests }
            .flatMap { $0.activities }
            .filter { !$0.attachments.isEmpty }
            .map(DesignReviewActivity.init)
    }

    // PRAGMA MARK: - HTML

    var htmlTemplate = HTMLTemplates.testDesignReview

    var htmlPlaceholderValues: [String: String] {
        return [
            "UUID": NSUUID().uuidString,
            "DESIGN_REVIEW_ACTIVITIES": activities
                .map { $0.html }
                .joined()
        ]
    }
}
