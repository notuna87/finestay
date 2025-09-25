import "./AccommoTitle.css";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAccommo } from "../../js/sub";

function AccommoTitle() {
  const [searchParams] = useSearchParams();
  const [accommo, setAccommo] = useState(null);

  const id = searchParams.get("id");
  useEffect(() => {
    if (!id) return;
    getAccommo(id).then(setAccommo);
  }, [id]);

  return (
    <>
      <div className="AccommoTitleWrap">
        <div className="AccommoTitle">
          <h2>{accommo?.title}</h2>
          <p>{accommo?.location}</p>
        </div>
        <div className="AccommoButton">
          <div className="shareButton">
            <img src="\img\icon\share.png"></img>
          </div>
          <div className="heartButton">
            <img src="\img\icon\like.png"></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccommoTitle;
