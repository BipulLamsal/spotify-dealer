import getAccessToken from "./RefreshToken";
const SPOTIFY_COLLECTION_NAME = "spotify_tokens";
import { db } from "../../firebaseAuth";

const storeSpotifyToken = async (
  userId: string,
  userName: string,
  access_token: string,
  refresh_token: string | undefined
): Promise<boolean> => {
  try {
    if (!userId || !access_token || !refresh_token || !userName) {
      return false;
    }
    const userRef = db.collection(SPOTIFY_COLLECTION_NAME).doc(userId);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      // update document
      // const { SPOTIFY_CLIENT_ID } = await parseEnv();
      const tokendata = await getAccessToken(refresh_token);
      if (tokendata)
        await userRef.update({
          refresh_token: refresh_token,
          access_token: tokendata,
          userName: userName,
          timestamp: new Date(),
        });
    } else {
      // new document
      await db.collection(SPOTIFY_COLLECTION_NAME).doc(userId).set({
        userId,
        access_token,
        refresh_token,
        userName,
        timestamp: new Date(),
      });
    }

    return true;
  } catch (err) {
    console.error("Error storing Spotify tokens:", err);
    return false;
  }
};

export default storeSpotifyToken;
