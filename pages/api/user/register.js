import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

export default async function userRegisterRoute(req, res) {
  if (req.method === "POST") {
    const { username, password, isAdmin } = req.body;

    //validate body
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0 ||
      typeof isAdmin !== "boolean"
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid request body" });

    //check if username is already in database
    const client = new MongoClient(process.env.MONGO_CONN_STR);
    await client.connect();
    const cursor = client.db("micro-mini").collection("users").find();
    const users = await cursor.toArray();

    const foundUsername = users.find((x) => username === x.username);
    if (foundUsername) {
      client.close();
      return res
        .status(400)
        .json({ ok: false, message: "Username is already taken" });
    }

    //create new user and add in db
    const newUser = {
      username: username,
      password: bcrypt.hashSync(password, 12),
      isAdmin: isAdmin,
    };
    await client.db("micro-mini").collection("users").insertOne(newUser);
    client.close();

    //return response
    res.json({ ok: true, username, isAdmin });
  }
}
