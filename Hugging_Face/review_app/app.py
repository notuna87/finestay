# Flask 관련
from flask import Flask, render_template, request, redirect, url_for, jsonify, Response
from flask_cors import CORS

# 사용자 정의 모듈
from models.sentiment_model import analyze_sentiment  # 감성 분석 함수
from config import DB_URI                             # DB 연결 문자열

# DB 관련
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# JSON 처리 관련
import json  # 한글 인코딩 유지 (ensure_ascii=False) 사용

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:8080"])

# DB 연결 설정
engine = create_engine(DB_URI, echo=True)
Session = sessionmaker(bind=engine)



@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # 폼에서 입력된 리뷰 텍스트 추출
        review = request.form['review']
        # 감성 점수 분석
        sentiment = analyze_sentiment(review)

        # 리뷰 및 감성 점수를 DB에 저장
        with engine.begin() as conn:
            conn.execute(text("""
                INSERT INTO reviews (review_text, sentiment_score) VALUES (:review, :sentiment)
            """), {"review": review, "sentiment": sentiment})

        # 유사 감성 점수를 가진 리뷰 5개 추천
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT review_text, sentiment_score FROM reviews
                WHERE ABS(sentiment_score - :sentiment) <= 1
                ORDER BY ABS(sentiment_score - :sentiment) ASC
                LIMIT 5
            """), {"sentiment": sentiment})
            recommendations = result.fetchall()

        # 결과 페이지 렌더링
        return render_template('result.html', review=review, sentiment=sentiment, recommendations=recommendations)

    # GET 요청: 최신 리뷰 20개 조회해서 화면에 출력
    with engine.connect() as conn:
        result = conn.execute(text("SELECT review_text, sentiment_score FROM reviews ORDER BY id DESC LIMIT 20"))
        review_list = result.fetchall()

    # 메인 페이지 렌더링
    return render_template('index.html', review_list=review_list)


# REST API - GET:최근 리뷰 5개 조회
@app.route('/api/reviews', methods=['GET'])
def get_recent_reviews():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT review_text, sentiment_score
            FROM reviews
            ORDER BY id DESC
            LIMIT 5
        """))
        reviews = [dict(row._mapping) for row in result.fetchall()]

    
    # 한글 깨짐 방지 처리
    return Response(
        json.dumps(reviews, ensure_ascii=False),
        content_type='application/json; charset=utf-8'
    )

# REST API -  POST:감성 분석 후 저장 및 추천
@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    try:
        data = request.get_json()
        review = data.get("review", "").strip()

        # 유효성 검사
        if not review:
            return Response(json.dumps({"status": "fail", "message": "리뷰 내용이 없습니다."}, ensure_ascii=False), content_type='application/json; charset=utf-8'), 400
        if len(review) > 500:
            return Response(json.dumps({"status": "fail", "message": "리뷰가 너무 깁니다."}, ensure_ascii=False), content_type='application/json; charset=utf-8'), 400

        # 감성 분석
        sentiment = analyze_sentiment(review)

        # DB 저장
        with engine.begin() as conn:
            conn.execute(text("""
                INSERT INTO reviews (review_text, sentiment_score)
                VALUES (:review, :sentiment)
            """), {"review": review, "sentiment": sentiment})

        # 유사 리뷰 추천
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT review_text, sentiment_score
                FROM reviews
                WHERE ABS(sentiment_score - :sentiment) <= 1
                ORDER BY ABS(sentiment_score - :sentiment) ASC
                LIMIT 5
            """), {"sentiment": sentiment})
            recommendations = [dict(row._mapping) for row in result.fetchall()]

        # 응답
        response_data = {
            "status": "success",
            "review": review,
            "sentiment": sentiment,
            "recommendations": recommendations
        }
        return Response(json.dumps(response_data, ensure_ascii=False), content_type='application/json; charset=utf-8')

    except Exception as e:
        return Response(json.dumps({"status": "error", "message": str(e)}, ensure_ascii=False), content_type='application/json; charset=utf-8'), 500

# 앱 실행
if __name__ == '__main__':
    app.run(debug=True)