import axios from "axios";
import querystring from "querystring";
import parseEnv from "./EnvParser";

const getAccessToken = async (refresh_token: string | undefined) => {
  try {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = await parseEnv();
    const basicAuth = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log(response.status);
    if (response.status === 200) {
      // console.log(response.data);
      return response.data.access_token;
      // return [response.data.refresh_token, response.data.access_token]; // f only had access_token
    } else {
      throw new Error("Failed to fetch the refresh token");
    }
  } catch (err) {
    console.log(err);
  }
};
export default getAccessToken;
