import parseEnv from "@/utility/EnvParser";
import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";
import axios from "axios";
import storeSpotifyToken from "@/utility/StoreToken";

// const SPOTIFY_COLLECTION_NAME = "spotify_tokens";

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
    const { access_token, refresh_token } = response.data;
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
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (response.ok) {
      const userData = await response.json();

      return userData.id;
    } else {
      console.error("Error fetching Spotify user ID:", response.statusText);
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
      console.error("Error fetching Spotify user ID:", response.statusText);
      return null;
    }
  } catch (err) {
    console.error("Error fetching Spotify user ID:", err);
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
