import "./Search.css";
import { useNavigate } from "react-router-dom";

function Search() {
      const navigate = useNavigate();

  return (
    <>
      <div className="searchWrap">
        <div className="logoWrap">
          <img className="logo_white" src="\img\logo\logo_white.png" alt="logo"></img>
        </div>
        <div className="introduce">
            <p className="bigIntroduce">좋은 여행의 시작은<br/>좋은 숙소에서</p>
            <p className="smallIntroduce">프리미엄 감성 숙박으로<br/>특별한 순간을 경험해보세요</p>
        </div>
        <div onClick={() => navigate(`/searchopen`)} className="searchBar">
            <div className="searchIconWrap">
                <img src="\img\icon\search.png"></img>
            </div>
            <div className="searchTextArea">
                <p className="searchTextAreaTop">지역·날짜·인원 검색</p>
                <p className="searchTextAreaBottom">원하는 조건을 입력해보세요</p>
            </div>
        </div>
      </div>
    </>
  );
}

export default Search;
