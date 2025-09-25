import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAccommo } from "../../js/sub";
import "./LocationReservationNotice.css";

function LocationReservationNotice() {
  const [searchParams] = useSearchParams();
  const [accommo, setAccommo] = useState(null);
  const id = searchParams.get("id");

  // 숙소 데이터 불러오기
  useEffect(() => {
    if (!id) return;
    getAccommo(id).then(setAccommo);
  }, [id]);

  // 지도 표시
  useEffect(() => {
    if (!accommo?.coordinate) return;

    if (!window.kakao) {
      console.error("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    // "33.528481, 126.877203\r\n" → [33.528481, 126.877203]
    const [lat, lng] = accommo.coordinate
      .replace(/\r?\n|\r/g, "") // 줄바꿈 제거
      .split(",")
      .map((v) => Number(v.trim())); // 문자열 → 숫자 변환

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
      draggable: true,
      scrollwheel: true,
    };

    const map = new window.kakao.maps.Map(container, options);

    // 마커 위치
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: map,
      title: accommo.title,
    });

    // 클릭 이벤트
    window.kakao.maps.event.addListener(marker, "click", () => {
      alert(`${accommo.title} 위치 마커 클릭됨!`);
    });
  }, [accommo]);

  return (
    <div className="locationWrap">
      <div className="location">
        <h2>위치</h2>
        <div id="map" style={{ width: "100%", height: "400px" }}></div>
      </div>

      {/* 예약 하기 */}
      <div className="reservation">
        <h3>{accommo?.title}</h3>
        <p className="reservationAddress">{accommo?.location}</p>

        <table>
          <tbody>
            <tr>
              <td className="reservationDateSelect">
                <p className="reservationButtonTitle">날짜</p>
                <p className="reservationButtonContent">날짜를 선택해주세요</p>
              </td>
              <td className="reservationPepleSelect">
                <p className="reservationButtonTitle">인원</p>
                <p className="reservationButtonContent">성인 2명</p>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="reservationRoomSelect">
          <p className="reservationButtonTitle">객실</p>
          <p className="reservationButtonContent">{accommo?.title}</p>
        </div>

        <div className="reservationButton">
          <p>예약하기</p>
        </div>
      </div>

      {/* 안내 사항 */}
      <div className="noticeWrap">
        <div className="notice">
          <h2>안내 사항</h2>
          <div className="noticeTableWrap">
            <table>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    체크인 & 체크아웃: - 입실 시간 오후 3시, 퇴실 오전 11시입니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    시설 이용 안내: - 화롯대 기본 참나무 장작(10kg)은 무료 제공
                    됩니다. (날씨 상황에 따라 이용이 제한될 수 있습니다.) -
                    수영장(한 겨울에도 이용 가능한 온수 포함) 이용은 1박 10만원,
                    2박이상시 2박째부터 일 8만원이 추가 됩니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    인원 규정 준수: - 기준인원은 4인까지입니다. 미취학 유아
                    동반시 인원에 포함하지 않으나 별도 침구는 제공 되지
                    않습니다. 보호자가 없는 미성년자, 반려 동물 동반 시 입실
                    하실 수 없습니다. - 최대 5명까지만 입실 가능하며 1명분의
                    토퍼 매트리스와 침구를 제공 해드립니다. (1인 추가시 3만원
                    추가 비용이 있습니다.) - 기준인원 초과시 사전에 알리시지
                    않는 경우 응하시지 않는 경우 환불 없이 예약 및 숙소 제공이
                    취소 될 수 있습니다. - 반려동물은 숙소의 특성상 많은
                    손님들이 함께 이용하는 공간이기에 입실이 불가 합니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>숙소 내 금연: - 실내에서는 금연입니다. 꼭 지켜주세요.</td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    방역 및 위생 관리: - 방역업체와 계약을 통해 전문적으로
                    방역을 진행하고 있으나, {accommo?.title}는 주변에 바다와 밭,
                    자연이 있어 날벌레, 곤충이 발견될 수 있습니다. 이를 이유로
                    예약 취소 및 환불은 불가능합니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    기본 에티켓: - 파티용품 등 벽에 테이프, 접착제 사용은
                    불가합니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    취사 안내: - 삼겹살 등 냄새가 심한 음식은 음식조리가
                    불가합니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    변상 책임: - 시설 비품의 파손,반출,분실 시 변상비가
                    청구됩니다.
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    안전사고 주의: - 게스트의 개인 용품의 분실물 발생시 책임지지
                    않습니다. 퇴실때 놓고 가시는 물품이 없는지 꼭 확인
                    부탁드립니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationReservationNotice;
