import { getSpotifyAuthUrl } from "@/utility/TokenGetter";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const SPOTIFY_AUTH_URI = await getSpotifyAuthUrl();
    if (SPOTIFY_AUTH_URI) res.redirect(SPOTIFY_AUTH_URI);
  } catch (err) {
    console.error(`Error getting Spotify authorization URL: ${err}`);
    // res.status(500).end();
  }
}
