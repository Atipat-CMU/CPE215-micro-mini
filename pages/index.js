import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import BoxDevice from "../components/BoxDevice";
import { mqttConnect, mqttSub, mqttPublish } from "../mqtt/mqttLib";
import { callUserTestToken } from "../mqtt/authLib";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function DashboardPage() {
  const [client, setClient] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [deviceList, setDeviceList] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    console.log("use");
  };

  const router = useRouter();

  const connect = async () => {
    try {
      const res = await axios.get("./api/device");
      setDeviceList(res.data.devicelist);
    } catch (err) {
      alert(err.response.data.message);
    }
    setClient(mqttConnect());
  };

  const updateDeviceList = (device) => {
    const deviceID = deviceList.findIndex((x) => {
      return x.device_id == device.device_id;
    });
    console.log(deviceID);
    const newDeviceList = [...deviceList];
    newDeviceList[deviceID].slots = device.slots;
    setDeviceList(newDeviceList);
  };

  const callUserTestToken = async () => {
    const token = localStorage.getItem("token");
    try {
      const resp = await axios.get("/api/user/testToken", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.data.ok) {
        setIsAuth(true);
      }
    } catch (err) {
      // alert(err.response.data.message);
      if (client) client.end();
      router.push("/login");
    }
  };

  useEffect(() => {
    callUserTestToken();
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("Connected");
        deviceList.map((x) => {
          mqttSub(client, {
            topic: `CPE215_Group17/${x.device_id}`,
            qos: 0,
          });
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
        const payload = { topic, message: JSON.parse(message) };
        updateDeviceList(payload.message);
      });
    } else {
      if (isAuth) connect();
    }
  }, [client, isAuth]);

  return (
    <div>
      <div>
        {deviceList.map((x) => {
          return (
            <BoxDevice
              key={x.device_id}
              name={x.device_name}
              slots={x.slots}
              client={client}
              onSelect={handleShow}
            ></BoxDevice>
          );
        })}
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Is you Finish</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please reset when you already Finish</Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
            }}
          >
            Finish
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
