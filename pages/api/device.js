import { MongoClient } from "mongodb";

export default async function roomRoute(req, res) {
  const client = new MongoClient(process.env.MONGO_CONN_STR);
  await client.connect();
  const cursor = client.db("micro-mini").collection("device").find();
  const devicelist = await cursor.toArray();
  client.close();

  return res.json({
    ok: true,
    devicelist,
  });
}
