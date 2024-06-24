import { NextApiRequest, NextApiResponse } from "next";
import { fetchSpotifyData } from "./badge/[uid]";
import cors from "@/utility/Cors";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const corsHandled = cors(req, res);
  if (corsHandled) return;
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    let spotifyData = await fetchSpotifyData(userId.toString());
    return res.status(200).json(spotifyData);

  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error", message: err });
  }
}
