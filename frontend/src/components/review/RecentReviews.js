import React from "react";

function RecentReviews({ reviews }) {
  return (
    <ul className="RecentlyReview">
      {reviews.map((r, idx) => (
        <li key={idx}>
          {r.review_text} ({"⭐".repeat(r.sentiment_score)})
        </li>
      ))}
    </ul>
  );
}

export default RecentReviews;
