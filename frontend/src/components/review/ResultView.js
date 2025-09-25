import React from "react";

function ResultView({ result }) {
  return (
    <div className="reviewResultWrap">
      <h3><strong>분석 결과</strong></h3>
      <p>
        <strong>입력 리뷰 : </strong>
        {result.review}
      </p>
      <p>
        <strong>감성점수 : </strong>
        {"⭐".repeat(result.sentiment)}
      </p>

      <h4><strong>나와 유사한 리뷰</strong></h4>
      <ul>
        {result.recommendations.map((item, idx) => (
          <li key={idx}>
            {item.review_text} (점수 : {"⭐".repeat(item.sentiment_score)})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultView;
