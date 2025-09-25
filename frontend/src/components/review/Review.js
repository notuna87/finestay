import React, { useState, useEffect } from "react";
import ReviewForm from "../review/ReviewForm";
import RecentReviews from "../review/RecentReviews";
import ResultView from "../review/ResultView";
import "./Review.css";

function Review() {
  const [recentReviews, setRecentReviews] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/reviews")
      .then((res) => res.json())
      .then((data) => setRecentReviews(data))
      .catch((err) => console.error("최근 리뷰 가져오기 실패", err));
  }, []);

  const handleAnalysisResult = (data) => {
    setResult(data);
    // 분석 요청 후 최근 리뷰도 갱신
    fetch("http://localhost:5000/api/reviews")
      .then((res) => res.json())
      .then((data) => setRecentReviews(data));
  };
  return (
    <>
      <div className="review" style={{ paddingTop: "80px" }}>
          <div className="border"></div>
        <div className="reviewWrap">
          <div style={{ padding: "20px" }}>
            <h3><strong>최근 리뷰 및 별점</strong></h3>
            <RecentReviews reviews={recentReviews} />

            <h3><strong>내 리뷰, 점수로 확인하기</strong></h3>
            <ReviewForm onResult={handleAnalysisResult} />

            {result && <ResultView result={result} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Review;
