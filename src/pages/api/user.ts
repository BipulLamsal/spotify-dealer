import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebaseAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const SPOTIFY_COLLECTION_NAME = "spotify_tokens";

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userID parameter" });
    }
    const userRef = db
      .collection(SPOTIFY_COLLECTION_NAME)
      .doc(userId as string);

    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    const userData = userSnapshot.data();

    if (!userData) {
      return res.status(500).json({ message: "User data is undefined" });
    }

    res.status(200).json({ userName: userData.userName });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
