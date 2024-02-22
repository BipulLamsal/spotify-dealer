interface EnvConfig {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REDIRECT_URI: string;
}

const parseEnv = async (): Promise<EnvConfig> => {
  return new Promise((resolve, reject) => {
    try {
      const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
      const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
      const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
      console.log(
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REDIRECT_URI
      );
      if (
        !SPOTIFY_CLIENT_ID ||
        !SPOTIFY_CLIENT_SECRET ||
        !SPOTIFY_REDIRECT_URI
      ) {
        throw new Error("Missing required environment variables");
      }
      resolve({
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REDIRECT_URI,
      });
    } catch (error) {
      reject(error);
    }
  });
};
export default parseEnv;
