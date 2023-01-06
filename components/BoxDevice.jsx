import React, { useEffect, useState } from "react";
import SlotList from "./SlotList";

function BoxDevice(props) {
  const [isShow, setIsShow] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    setSlots(props.slots);
    console.log("useEffect logic ran");
  }, [props.slots]);

  return (
    <div className="rounded device-box">
      <div
        className={isShow ? "header-s" : "header"}
        onClick={() => {
          setIsShow(!isShow);
        }}
      >
        <div className="text-h">{props.name}</div>
        <div className="round-border danger">Busy</div>
      </div>
      {isShow && (
        <div>
          {slots.map((x, i) => {
            return (
              <SlotList
                key={i}
                id={i + 1}
                client={props.client}
                onSelect={props.onSelect}
              >
                {" "}
              </SlotList>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BoxDevice;
