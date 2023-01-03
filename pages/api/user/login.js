import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

export default async function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0
    )
      return res
        .status(400)
        .json({ ok: false, message: "Username or password cannot be empty" });
    const client = new MongoClient(process.env.MONGO_CONN_STR);
    await client.connect();
    const foundUser = await client
      .db("micro-mini")
      .collection("users")
      .findOne({ username: username });
    client.close();
    if (
      foundUser === null ||
      bcrypt.compareSync(password, foundUser.password) === false
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid Username or Password" });

    // const users = readUsersDB();
    // const foundUser = users.find(
    //   (x) => x.username === username && bcrypt.compareSync(password, x.password) //compare raw password with hashed
    // );
    // if (!foundUser)
    //   return res
    //     .status(400)
    //     .json({ ok: false, message: "Invalid Username or Password" });

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        username: foundUser.username,
      },
      secret,
      {
        expiresIn: "1800s",
      }
    );

    return res.json({ ok: true, token });
  }
}
