import axios from "axios";
import querystring from "querystring";

const getAccessToken = async (refresh_token: string, client_id: string) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: client_id,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status === 200) {
      return [response.data.refresh_token, response.data.access_token];
    }
  } catch (err) {
    console.log(err);
  }
};
export default getAccessToken;
