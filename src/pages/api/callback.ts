import parseEnv from "@/utility/EnvParser";
import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import axios from "axios";
import storeSpotifyToken from "@/utility/StoreToken";
import getAccessToken from "@/utility/RefreshToken";

// const SPOTIFY_COLLECTION_NAME = "spotify_tokens";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
    await parseEnv();
    const code = req.query?.code ?? null;
    const basicAuth = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");
    // console.log(basicAuth);

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + basicAuth,
        },
      }
    );
    const { refresh_token } = response.data;
    // console.log( await getAccessToken(refresh_token))
    console.log("old accesstoken : ", response.data.access_token);
    const access_token = await getAccessToken(refresh_token);
    console.log(access_token);
    // console.log(response.data.token_type);
    // console.log(response.data.scope);
    // console.log("What is up there : ");

    // console.log(access_token);
    // console.log(access_token, "----------------------", refresh_token);
    // initial fetch to user id to store to firestore
    const userId = await fetchUserId(access_token);
    // mutiple request to same endpoint which idc
    const userName = await fetchUserName(access_token);
    if (!userId || !userName) {
      return res.status(500).json({ error: "Failed to fetch Spotify user ID" });
    }
    const storedSuccessfully = await storeSpotifyToken(
      userId,
      userName,
      access_token,
      refresh_token
    );

    if (storedSuccessfully) {
      res.redirect(`/dashboard/${userId}`);
    } else {
      res.status(500).json({ error: "Failed to store Spotify tokens" });
    }
  } catch (err) {
    console.error("Error in Spotify token request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const fetchUserId = async (access_token: string): Promise<string | null> => {
  try {
    // console.log(access_token);
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    });
    // console.log(response);

    if (response.ok) {
      const userData = await response.json();
      return userData.id;
    } else {
      console.error("Error fetching Spotify user ID:", response);
      return null;
    }
  } catch (err) {
    console.error("Error fetching Spotify user ID:", err);
    return null;
  }
};

const fetchUserName = async (access_token: string): Promise<string | null> => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData.display_name;
    } else {
      console.error("Error fetching Spotify username:", response);
      return null;
    }
  } catch (err) {
    console.error("Error fetching Spotify user name:", err);
    return null;
  }
};

// const storeSpotifyToken = async (
//   userId: string,
//   access_token: string,
//   refresh_token: string
// ): Promise<boolean> => {
//   try {
//     if (!userId || !access_token || !refresh_token) {
//       return false;
//     }
//     const userRef = db.collection(SPOTIFY_COLLECTION_NAME).doc(userId);
//     const userSnapshot = await userRef.get();
//     if (userSnapshot.exists) {
//       // update document
//       // const { SPOTIFY_CLIENT_ID } = await parseEnv();
//       const tokendata = await getAccessToken(refresh_token);
//       if (tokendata)
//         await userRef.update({
//           refresh_token: refresh_token,
//           access_token: tokendata,
//           timestamp: new Date(),
//         });
//     } else {
//       // new document
//       await db.collection(SPOTIFY_COLLECTION_NAME).doc(userId).set({
//         userId,
//         access_token,
//         refresh_token,
//         timestamp: new Date(),
//       });
//     }

//     return true;
//   } catch (err) {
//     console.error("Error storing Spotify tokens:", err);
//     return false;
//   }
// };
