import "./Slider.css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "swiper/css/pagination";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

function SliderOne() {
  const navigate = useNavigate();
  const [accommos, setAccommos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/accommo")
      .then((res) => setAccommos(res.data))
      .catch((err) => console.error(err));
  }, []);

  let swiperDesign = {
    height: "100%",
    width: "100%",
  };

  let sliderDesign = {
    height: "100%",
    width: "24%",
    transform: "translateX(-31px)",
    transition: "0.3s",
  };

  return (
    <>
      <div className="swiperWrap">
        {/* 슬라이더 제목 */}
        <div className="sliderTitle">
          <h1>
            파도 소리와 함께
            <br />
            아침을 맞이하고 싶을 때
          </h1>
        </div>
        {/* 슬라이더 제목 끝 */}
        {/* 스와이퍼 슬라이더 시작 */}
        <div className="sliderWrap">
          <Swiper
            spaceBetween={30}
            slidesPerView={4}
            loop={true}
            style={swiperDesign}
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation]}
          >
            {accommos.map((accommo) => {
              if(`${accommo.mainExhibition}`== 0){
              return (
                <SwiperSlide
                  onClick={() => navigate(`/accommo?id=${accommo.id}`)}
                  style={sliderDesign}
                  className="swiperSlide"
                >
                  <div className="sliderImgWrap">
                    <img
                      src={`${accommo.img}01.jpg`}
                      alt={`${accommo.title}.img`}
                    ></img>
                    <div className="imgTextBox">
                      <table>
                        <td className="titleAndArea">
                          <p className="accommodationName">{accommo.title}</p>
                          <p>{accommo.location}</p>
                        </td>
                        <td className="price" colSpan={2}>
                          {accommo?.price?.toLocaleString()}원~
                        </td>
                      </table>
                    </div>
                  </div>
                </SwiperSlide>
              );
              }
            })}
          </Swiper>
        </div>
        {/* 스와이퍼 슬라이더 끝 */}
      </div>
    </>
  );
}

export default SliderOne;
