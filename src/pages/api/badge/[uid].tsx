import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../firebaseAuth";

const POLLING_INTERVAL = 300000; // 5 mins
const SPOTIFY_COLLECTION_NAME = "spotify_tokens";

interface FirestoreData {
  userId: string;
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

    const svg = generateSvg(spotifyData);

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
  } catch (error) {
    console.error("Error generating SVG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function fetchSpotifyData(userId: string) {
  try {
    const collectionRef = db.collection(SPOTIFY_COLLECTION_NAME);
    const snapshot = await collectionRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      console.error("No document found for userId:", userId);
      return;
    }
    const data: FirestoreData = {
      userId: snapshot.docs[0].id,
      access_token: snapshot.docs[0].data().access_token,
      refresh_token: snapshot.docs[0].data().refresh_token,
    };
    const player = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
    console.log(player.status)
    if (player.status === 401) {
      //accesstoken expires
    }
    if (player.status === 200) {
      const player_json = await player.json();
      const { is_playing, item } = player_json;

      if (is_playing) {
        return {
          status: true,
          lastPlayedSong: item ? item.name : "Unknown Song",
        };
      } else {
        const lastPlayed = await fetch(
          "https://api.spotify.com/v1/me/player/recently-played",
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          }
        );
        if (lastPlayed.status === 200) {
          const lastPlayed_json = await lastPlayed.json();
          const lastPlayedItem = lastPlayed_json.items[0];
          return {
            status: false,
            lastPlayedSong: lastPlayedItem
              ? lastPlayedItem.track.name
              : "Unknown Song",
          };
        }
      }
    }
    console.error("Error fetching player data:", player.statusText);
    return {
      status: false,
      lastPlayedSong: "Unknown Song",
    };
  } catch (err) {
    console.error("Error fetching data from Firestore:", err);
    return {
      status: false,
      lastPlayedSong: "Unknown Song",
    };
  }
}

function generateSvg(spotifyData: any) {
  const statusColor = spotifyData.status ? "green" : "red";
  const svg = `<svg width="200" height="80">
      <rect width="100%" height="100%" fill="${statusColor}" />
      <text x="10" y="20" fill="white">Status: ${
        spotifyData.status ? "Playing" : "Paused"
      }</text>
      <text x="10" y="40" fill="white">Last Played Song: ${
        spotifyData.lastPlayedSong
      }</text>
    </svg>`;

  return svg;
}
