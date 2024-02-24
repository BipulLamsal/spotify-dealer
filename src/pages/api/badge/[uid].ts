import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../firebaseAuth";
import generateSvg from "@/utility/SVGgenerator";
import storeSpotifyToken from "@/utility/StoreToken";
import getAccessToken from "@/utility/RefreshToken";

const POLLING_INTERVAL = 300000; // 5 mins
const SPOTIFY_COLLECTION_NAME = "spotify_tokens";

interface FirestoreData {
  userId: string;
  userName: string;
  access_token: string;
  refresh_token: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { uid } = req.query;
    const spotifyData = await fetchSpotifyData(uid as string);
    const svg = await generateSvg(spotifyData);
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
  } catch (error) {
    // console.error("Error generating SVG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function fetchFirestoreData(
  userId: string
): Promise<FirestoreData | null> {
  try {
    const collectionRef = db.collection(SPOTIFY_COLLECTION_NAME);
    const snapshot = await collectionRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      console.error("No document found for userId:", userId);
      return null;
    }

    const data: FirestoreData = {
      userId: snapshot.docs[0].id,
      userName: snapshot.docs[0].data().userName,
      access_token: snapshot.docs[0].data().access_token,
      refresh_token: snapshot.docs[0].data().refresh_token,
    };
    if (data.access_token) {
      return data;
    } else {
      console.error("Access token not found for userId:", userId);
      return null;
    }
  } catch (err) {
    console.error("Error fetching data from Firestore:", err);
    throw new Error("Failed to fetch data from Firestore");
  }
}

async function fetchSpotifyData(userId: string) {
  try {
    const token = await fetchFirestoreData(userId);
    const player = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    });
    if (player.status === 200) {
      const player_json = await player.json();
      const { is_playing, item } = player_json;

      if (is_playing) {
        return {
          status: true,
          song_name: item ? item.name : "Unknown Song",
          artist_name: item ? item.artists[0].name : "Unknown Artist",
          song_image: item ? item.album.images[0]?.url : null,
        };
      } else {
        const lastPlayed = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played",
          {
            headers: {
              Authorization: `Bearer ${token?.access_token}`,
            },
          }
        );
        if (lastPlayed.status === 200) {
          const lastPlayed_json = await lastPlayed.json();
          const lastPlayedItem = lastPlayed_json.items[0];

          return {
            status: false,
            song_name: lastPlayedItem
              ? lastPlayedItem.track.name
              : "Unknown Song",
            artist_name: lastPlayedItem
              ? lastPlayedItem.track.artists[0].name
              : "Unknown Artist",
            song_image: lastPlayedItem
              ? lastPlayedItem.track.album.images[0]?.url
              : null,
          };
        } else {
          console.error(
            "Error fetching last played data:",
            lastPlayed.statusText
          );
          throw lastPlayed.statusText;
          // return {
          //   status: false,
          //   song_name: "Unknown Song",
          //   artist_name: "Unknown Artist",
          //   song_image: null,
          // };
        }
      }
    }
    // sometime resposne is not received so its exception for handling the player status
    if (player.status === 204) {
      const lastPlayed = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: {
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );

      if (lastPlayed.status === 200) {
        const lastPlayed_json = await lastPlayed.json();
        const lastPlayedItem = lastPlayed_json.items[0];

        return {
          status: false,
          song_name: lastPlayedItem
            ? lastPlayedItem.track.name
            : "Unknown Song",
          artist_name: lastPlayedItem
            ? lastPlayedItem.track.artists[0].name
            : "Unknown Artist",
          song_image: lastPlayedItem
            ? lastPlayedItem.track.album.images[0]?.url
            : null,
        };
      } else {
        console.error(
          "Error fetching last played data:",
          lastPlayed.statusText
        );
        return lastPlayed.statusText;
        // return {
        //   status: false,
        //   song_name: "Unknown Song",
        //   artist_name: "Unknown Artist",
        //   song_image: null,
        // };
      }
    }

    // renewing the token
    if (player.status === 401) {
      const access_token = await getAccessToken(token?.refresh_token);
      if (token)
        storeSpotifyToken(
          userId,
          token?.userName,
          access_token,
          token?.refresh_token
        );
    }

    // console.error("Error fetching player data:", player.statusText);
    throw player.statusText;
    // return {
    //   status: false,
    //   song_name: "Unknown Song",
    //   artist_name: "Unknown Artist",
    //   song_image: null,
    // };
  } catch (err) {
    console.error("Error fetching data from Firestore:", err);
    throw err;
    // return {
    //   status: false,
    //   song_name: "Unknown Song",
    //   artist_name: "Unknown Artist",
    //   song_image: null,
    // };
  }
}
