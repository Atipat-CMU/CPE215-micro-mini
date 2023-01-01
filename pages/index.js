import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import BoxDevice from "../components/BoxDevice";
import { mqttConnect, mqttSub, mqttPublish } from "../mqtt/mqttLib";

export default function Home() {
  const [client, setClient] = useState(null);
  const [isSubed, setIsSub] = useState(false);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");

  const connect = async () => {
    // try {
    //   const res = await axios.get("./api/device");
    //   console.log(res);
    // } finally {

    // }
    setClient(mqttConnect());
  };

  useEffect(() => {
    console.log("Connecting");
    connect();
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("Connected");
        mqttSub(client, {
          topic: "CPE215_Group17",
          qos: 0,
        });
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
      });
    }
  }, [client]);

  return (
    <>
      <BoxDevice>tidi</BoxDevice>
    </>
  );
}
