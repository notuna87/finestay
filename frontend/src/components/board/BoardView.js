import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Table, Button, Spinner } from "react-bootstrap";

function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = localStorage.getItem("username");
  const hasToken = localStorage.getItem("token") !== null;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/boards/${id}`)
      .then((res) => setBoard(res.data))
      .catch((err) => {
        console.error(err);
        alert("상세 조회 실패");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!board) return null;

  const thStyle = {
    backgroundColor: "#f2f2f2",
    textAlign: "left",
    width: "150px",
  };

  return (
    <div className="boardviewWrap" style={{ paddingTop: "80px" }}>
      <div className="border"></div>
      <div className="container mt-4">
        <h2 className="mb-4">게시글</h2>
        <Table bordered hover responsive className="align-middle">
          <tbody>

            <tr>
              <th style={thStyle}>제목</th>
              <td style={{ textAlign: "left" }}>{board.title}</td>
            </tr>
            {board.createdBy && (
              <tr>
                <th style={thStyle}>작성자</th>
                <td style={{ textAlign: "left" }}>{board.createdBy}</td>
              </tr>
            )}
            <tr>
              <th style={thStyle}>글내용</th>
              <td style={{ textAlign: "left", wordBreak:"break-word" }}>{board.content}</td>
            </tr>
          </tbody>
        </Table>

        {/* 버튼 영역 */}
        <div className="d-flex justify-content-between mt-3">
          {/* 왼쪽: 수정 버튼 */}
          <div>
            {hasToken && board.createdBy === loginUser && (
              <Link to={`/edit/${board.id}`}>
                <Button variant="warning" style={{marginRight:"10px"}}>수정</Button>
              </Link>
            )}
            {/* 오른쪽: 리스트 버튼 */}
            <Link to="/board">
              <Button variant="secondary">목록으로</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardView;
