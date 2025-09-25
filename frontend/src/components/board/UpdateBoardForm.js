import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // URL 파라미터 및 페이지 이동
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api/axiosConfig"; // 커스텀 api import
import { jwtDecode } from "jwt-decode";

// 회원 수정 컴포넌트
const UpdateBoardForm = () => {
  const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
  const [username, setUsername] = useState(null);

  // URL의 id 파라미터 추출
  const { id } = useParams();

  // 페이지 이동 함수
  const navigate = useNavigate();

  // 회원 정보 상태 관리
  const [Board, setBoard] = useState({
    name: "",
    content: "",
    created_By: "", // 1 작성자 비교
  });

  // 2 진입 시 토큰 확인 + 데이터 조회 시 토큰 헤더 포함 + 작성자 본인 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
  let decoded = null; // 블록 밖에서 선언

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 토큰이 존재하면 username 추출
    if (token) {
      try {
        decoded = jwtDecode(token); // 토큰 디코딩 (payload 추출)
        console.log("디코딩된 JWT:", decoded);
        setUsername(decoded.sub); // state로 저장
      } catch (e) {
        console.error("토큰 해독 실패:", e);
      }
    }

    //http://localhost:8080/api/boards/${id}
    api
      .get(`/api/boards/${id}`) // axios → api 로 교체, 헤더 제거
      .then((res) => {
        setBoard(res.data);

        // 작성자 본인만 접근 허용
        if (res.data?.createdBy && res.data.createdBy !== decoded.sub) {
          alert("작성자만 수정할 수 있습니다.");
          navigate("/board");
        }
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("작성자만 수정할 수 있습니다.");
          navigate("/board");
        } else {
          alert("회원 조회 실패");
        }
        console.error(err);
      });
  }, [id, navigate]);

  // 입력값 변경 핸들링
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoard((prev) => ({ ...prev, [name]: value })); // 기존 값 유지하며 변경된 필드 업데이트
  };

  // 폼 제출 시 실행
  const handleSubmit = (e) => {
    e.preventDefault();

    // 3 제출 시에도 토큰 재확인(이중 안전장치)
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

    // 4 모든 유효성 통과 시 PUT 요청(수정)
    // http://localhost:8080/api/boards/${id}
    api
      .put(`/api/boards/${id}`, Board)
      .then(() => {
        alert("수정 완료!");
        navigate("/board"); // 메인 페이지로 이동
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          // 권한 에러 처리
          alert("작성자만 수정할 수 있습니다.");
        } else if (err.response?.status === 401) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("수정 실패");
        }
        console.error(err);
      });
  };

  return (
    <div className="updateBoardWrap" style={{ paddingTop: "80px" }}>
      <div className="border"></div>
      <Container className="mt-5">
        <h2 className="mb-4"> 글 수정</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Control type="hidden" name="id" value={Board.id} />

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
                style={{resize:"none",height:"250px"}}
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
            <Button variant="success" type="submit">
              저장
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default UpdateBoardForm;
