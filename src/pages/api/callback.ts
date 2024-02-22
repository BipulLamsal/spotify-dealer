import parseEnv from "@/utility/EnvParser";
import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
      await parseEnv();
    const code = req.query?.code ?? null;
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token } = response.data;
    res.redirect(`/dashboard?access_token=${access_token}`);
    // redirect(req, 302, `/dashboard?access_token=${access_token}`);
  } catch (err) {
    console.error("Error in Spotify token request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
