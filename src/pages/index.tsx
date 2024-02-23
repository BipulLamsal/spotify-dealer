import Image from "next/image";
import Layout from "../components/Layout";
import SpotifyImage from "../../public/spotifyicon.png";
// import parseEnv from "../utility/EnvParser";
import Link from "next/link";
const Index = () => {
  return (
    <Layout>
      <section className="min-h-screen w-full flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold rounded-sm text-zinc-100">
            Github Spotify Dealer
          </h1>
          <p className="text-zinc-300">
            Dealer to showcase your music taste to nerd audience via{" "}
            <span className="font-bold">Github Readme</span>
          </p>
          <Link
            href="/api/auth"
            className="bg-[#00d351] mt-5 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 text-zinc-900"
          >
            <Image
              src={SpotifyImage}
              width={40}
              height={40}
              alt="spotify-logo"
              className="rounded-lg"
            ></Image>
            Connect to spotify
          </Link>
        </div>
      </section>
    </Layout>
  );
};
export default Index;
