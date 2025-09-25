import "./Accommo.css";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAccommo } from "../../js/sub";

function Accommo() {
  const [searchParams] = useSearchParams();
  const [accommo, setAccommo] = useState(null);

  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    getAccommo(id).then(setAccommo); 
  }, [id]);

  return (
    <>
      <div className="accommoWrap">
        <div className="imgWrap">
          <table className="imgWrapTable">
            <tr>
              <td rowSpan={2} className="firstTd">
                <img src={`${accommo?.img}01.jpg`}></img>
              </td>
              <td>
                <img src={`${accommo?.img}02.jpg`}></img>
              </td>
            </tr>
            <tr>
              <td>
                <img src={`${accommo?.img}03.jpg`}></img>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
}

export default Accommo;
