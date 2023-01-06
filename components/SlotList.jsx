import React, { useState } from "react";
import { mqttConnect, mqttSub, mqttPublish } from "../mqtt/mqttLib";

export default function SlotList(props) {
  return (
    <div
      className={"header"}
      onClick={() => {
        mqttPublish(props.client, {
          topic: "group17/command",
          qos: 0,
          payload: `${props.id}`,
        });
        props.onSelect();
      }}
    >
      <div className="text-h">{props.id}</div>
    </div>
  );
}
