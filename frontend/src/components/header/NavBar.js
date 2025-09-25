import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
  let username = null;

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

  // 로그아웃 버튼 클릭 시 호출되는 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    navigate("/"); // 홈으로 이동
  };

  return (
    <>
      <div className="fixed">
        <div className="navBarWrap">
          <div className="logo">
            <img
              onClick={() => navigate(`/`)}
              src="\img\logo\logo_black.png"
              alt="logo"
            ></img>
          </div>

          <div className="navButton">
            <ul>
              <li onClick={() => navigate(`/`)}>숙소찾기</li>
              <li onClick={() => navigate(`/board`)}>게시판</li>
              <li onClick={() => navigate(`/review`)}>리뷰</li>
              {token ? (
                <>
                  <li onClick={() => handleLogout()}>로그아웃</li>
                </>
              ) : (
                <>
                  <li onClick={() => navigate(`/login`)}>로그인</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
