import jwt from "jsonwebtoken";

//return username | null
export function checkToken(req) {
  if (typeof req.headers.authorization !== "string") return null;
  const splited = req.headers.authorization.split(" ");
  const token = splited[1];
  const secret = process.env.JWT_SECRET;

  try {
    const result = jwt.verify(token, secret);
    return result.username;
  } catch (e) {
    return null;
  }
}
