import querystring from "querystring";
import parseEnv from "./EnvParser";
export const getSpotifyAuthUrl = async () => {
  const AUTHORIZE_URI = "https://accounts.spotify.com/authorize?";
  try {
    const parsedENV = await parseEnv();
    const AUTHORIZE_QUERY =
      AUTHORIZE_URI +
      querystring.stringify({
        response_type: "code",
        client_id: parsedENV.SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-read-email",
        redirect_uri: parsedENV.SPOTIFY_REDIRECT_URI,
        // state: "state",
      });
    return AUTHORIZE_QUERY;
  } catch (err) {
    console.log(`Something went wrong, ${err}`);
    // throw err;
  }
};
