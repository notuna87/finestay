import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

const NewBoardForm = () => {
  const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
  let username = null;

  // 입력값 상태 초기화
  const [Board, setBoard] = useState({
    name: "",
    content: "",
    created_by: "",
  });

  // 저장 후 페이지 이동용
  const navigate = useNavigate();

  // 페이지 진입 시 로그인 여부 체크 (직접 URL 접근 차단)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/board"); //  메인으로 리다이렉트
    }
  }, [navigate]); //  navigate 의존성

  // 토큰이 존재하면 username 추출
  if (token) {
    try {
      const decoded = jwtDecode(token); // 토큰 디코딩 (payload 추출)
      console.log("디코딩된 JWT:", decoded);
      username = decoded.sub; // payload에서 사용자 이름(sub) 추출
    } catch (e) {
      console.error("토큰 해독 실패:", e);
    }
  }

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoard((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 시 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 로그인 여부 확인 (이중 안전장치: 진입 체크 + 제출 시 재검사)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 제목 공백 검사
    if (!Board.title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    // 주소 공백 검사
    if (!Board.content.trim()) {
      alert("주소를 입력하세요.");
      return;
    }

    // 모든 유효성 통과 후 서버로 전송, POST 요청 (토큰 포함)
    // http://localhost:8080/api/boards
    api
      .post("/api/boards", Board)
      .then(() => {
        alert("등록 완료!");
        navigate("/board"); // 메인 페이지로 이동
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          alert("권한이 없습니다.");
        } else {
          alert("등록 실패");
        }
        console.error(error);
      });
  };

  return (
    <div className="newBoardWrap" style={{ paddingTop: "80px" }}>
      <div className="border"></div>

      <Container className="mt-5">
        <h2 className="mb-4">게시글 등록</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formName">
            <Form.Label column sm={2}>
              제목
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="title"
                value={Board.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formContent">
            <Form.Label column sm={2}>
              글내용
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                as="textarea"
                name="content"
                value={Board.content}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                style={{ resize: "none", height: "250px" }}
                required
              />
            </Col>
          </Form.Group>

          <Form.Control
            type="hidden"
            name="created_by"
            value={username}
            onChange={handleChange}
            required
          />

          <div className="text-end">
            <Button variant="primary" type="submit">
              저장
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default NewBoardForm;
