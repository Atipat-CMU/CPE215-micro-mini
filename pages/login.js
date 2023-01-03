import axios from "axios";
import { redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { checkToken } from "../backendLibs/checkToken";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const callUserTestToken = async () => {
    const token = localStorage.getItem("token");
    try {
      const resp = await axios.get("/api/user/testToken", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.data.ok) {
        router.push("/");
      }
    } catch (err) {
      // alert(err.response.data.message);
    }
  };

  const callUserLogin = async () => {
    try {
      const resp = await axios.post("./api/user/login", {
        username,
        password,
      });
      if (resp.data.ok) {
        localStorage.setItem("token", resp.data.token);
        router.push("/");
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  useEffect(() => {
    callUserTestToken();
  }, []);

  return (
    <div>
      <label>Username</label>
      <input
        placeholder="username..."
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <br />
      <label>Password</label>
      <input
        placeholder="password..."
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            callUserLogin();
          }
        }}
      />
      <button onClick={() => callUserLogin()}>Login</button>
    </div>
  );
}
