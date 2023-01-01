import React from "react";

function BoxDevice(props) {
  return (
    <div
      onClick={() => {
        alert("hello");
      }}
      className="rounded device-box"
    >
      <div>CPE-01</div>
    </div>
  );
}

export default BoxDevice;
