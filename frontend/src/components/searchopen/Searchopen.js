import React, { useState, useEffect } from "react";
import "./Searchopen.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { subDays, addDays } from "date-fns";
import { format } from "date-fns";

function Searchopen() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  // 버튼 클릭 → 열기/닫기
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // 날짜 선택 시 → 범위가 다 선택되면 닫기
  const handleChange = (update) => {
    setDateRange(update);

    if (update[0] && update[1]) {
      // 시작일과 종료일 둘 다 선택됐으면 닫기
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="searchOpenWrap">
        {/* 테두리용 가짜 div */}
        <div class="border"></div>
        {/* 지역/숙소명 시작 */}
        <div className="regionHouseNameWrap">
          {/* 지역/숙소명 제목 버튼*/}
          <div className="searchopenButton">
            <img src="\img\icon\search.png"></img>
            <div className="buttonTitleWrap">
              <p className="buttonTitle">지역/숙소명</p>
              <p className="buttonContent">전체</p>
            </div>
          </div>
          {/* text 인풋 */}
          <div className="regionHouseInputWrap">
            <input type="text" placeholder="숙소명으로 검색해보세요"></input>
            <img src="\img\icon\search.png"></img>
          </div>
          {/* 지역 선택 버튼 */}
          <p className="regionButtonTitle">지역</p>
          <div className="regionSelectButtonWrap">
            <div className="regionSelectButton regionSelectButtonselected">
              전체
            </div>
            <div className="regionSelectButton">제주</div>
            <div className="regionSelectButton">서울</div>
            <div className="regionSelectButton">강릉</div>
            <div className="regionSelectButton">부산</div>
          </div>
        </div>
        {/* 지역/숙소명 끝 */}

        {/* 날짜 시작 */}
        <div className="regionHouseNameWrap">
          {/* 지역/숙소명 제목 버튼*/}
          <div className="searchopenButton">
            <img src="\img\icon\calendar.png"></img>
            <div className="buttonTitleWrap ">
              <p className="buttonTitle">날짜</p>

          {/* 버튼 */}
              <button className="custom-input" onClick={handleClick}>
                {startDate && endDate
                  ? `${format(startDate, "MM월 dd일")} ~ ${format(
                      endDate,
                      "MM월 dd일"
                    )}`
                  : "날짜를 선택하세요"}
              </button>{" "}
            </div>
          </div>
          {/* DatePicker */}
          {isOpen && (
            <DatePicker
              locale={ko}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleChange}
              includeDateIntervals={[
                { start: subDays(new Date(), 1), end: addDays(new Date(), 30) },
              ]}
              inline
            />
          )}
        </div>
        {/* 지역/숙소명 끝 */}
      </div>
    </>
  );
}

export default Searchopen;
