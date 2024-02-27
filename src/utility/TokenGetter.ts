import querystring from "querystring";
import parseEnv from "./EnvParser";

export const getSpotifyAuthUrl = async () => {
  try {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = await parseEnv();

    const AUTHORIZE_URI = "https://accounts.spotify.com/authorize?";
    const AUTHORIZE_QUERY = querystring.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope:
        "user-read-private user-read-email user-read-playback-state user-read-recently-played user-read-currently-playing",
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });

    return `${AUTHORIZE_URI}${AUTHORIZE_QUERY}`;
  } catch (err) {
    console.error(`Error generating Spotify authorization URL: ${err}`);
    throw err; // Rethrow the error to be handled by the caller or a higher-level error handler
  }
};
