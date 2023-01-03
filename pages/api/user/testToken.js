import jwt from "jsonwebtoken";
export default function userTestTokenRoute(req, res) {
  if (req.method === "GET") {
    if (typeof req.headers.authorization !== "string")
      return res.status(401).json({ ok: false, message: "Invalid Token" });

    const splited = req.headers.authorization.split(" ");
    const token = splited[1];

    const secret = process.env.JWT_SECRET;
    try {
      const result = jwt.verify(token, secret);
      return res.json({ ok: true, username: result.username });
    } catch (e) {
      console.log(e.message);
      return res.status(401).json({ ok: false, message: "Invalid Token" });
    }
  }
}
