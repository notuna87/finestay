import "./AccommoDescription.css";
import { getAccommo } from "../../js/sub";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function AccommoDescription() {
  const [searchParams] = useSearchParams();
  const [accommo, setAccommo] = useState(null);

  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    getAccommo(id).then(setAccommo);
  }, [id]);
  return (
    <>
      <div className="discriptionWrap">
        <p>{accommo?.description}</p>
      </div>
    </>
  );
}

export default AccommoDescription;
