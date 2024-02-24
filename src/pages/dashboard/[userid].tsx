import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

const Dashboard: React.FC<{ accessToken: string }> = ({}) => {
  const router = useRouter();
  const { userid } = router.query;
  const [userName, setUserName] = useState<string | null>(null);
  const [availableStatus, setAvailableStatus] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [status_code, setStatusCode] = useState<string>("");
  const [apiURL, setApiURL] = useState<string | undefined>(
    process.env.NEXT_PUBLIC_API_URI
  );
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (userid) {
          setUserToken(userid as string);
          const apiUrl = `${apiURL}api/user?userId=${userid}`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setUserName(data.userName);
          setAvailableStatus(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setAvailableStatus(false);
      }
    };

    fetchUserName();
  }, [userid]);

  const copyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    try {
      if (status_code === "api_url") {
        await navigator.clipboard.writeText(`${apiURL}api/badge/${userid}`);
        setTimeout(() => {
          button.innerText = "Copy API URL";
        }, 500);
        button.innerText = "Copied ✨";
      } else if (status_code === "md_snippet") {
        await navigator.clipboard.writeText(
          `![spotify-dealer](${apiURL}api/badge/${userid})`
        );
        setTimeout(() => {
          button.innerText = "Copy MD snippet";
        }, 500);
        button.innerText = "Copied ✨";
      }
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
      setCopyStatus("Error copying to clipboard");
    }
  };

  return (
    <Layout>
      <section className="min-h-screen w-full flex justify-center items-center">
        {availableStatus && (
          <div className="text-center">
            <h1 className="text-4xl font-bold rounded-sm text-zinc-100">
              hey @{userName}
            </h1>
            <p className="text-zinc-300">
              Maybe I will try with other
              <span className="font-bold"> themes </span>,
            </p>
            <div className="">
              <img
                src={`${apiURL}api/badge/${userid}`}
                className="w-[400px] "
                alt={`Badge for ${userName}`}
              />
            </div>

            <div className="flex flex-wrap w-full gap-2">
              <button
                className="bg-[#00d351] mt-5 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 text-zinc-900 flex-1"
                onClick={(event) => {
                  setStatusCode("api_url");
                  copyToClipboard(event);
                }}
              >
                Copy API URL
              </button>
              <button
                className="bg-[#00d351] mt-5 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 text-zinc-900 flex-1"
                onClick={(event) => {
                  setStatusCode("md_snippet");
                  copyToClipboard(event);
                }}
              >
                Copy MD snippet
              </button>
            </div>
          </div>
        )}
        {!availableStatus && (
          <div className="text-center">
            <h1 className="text-4xl font-bold rounded-sm text-zinc-100">
              Take a break!
            </h1>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Dashboard;
