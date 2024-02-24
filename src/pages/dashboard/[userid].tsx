import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";

const Dashboard: React.FC<{ accessToken: string }> = ({}) => {
  const router = useRouter();
  const { userid } = router.query;
  const [userName, setUserName] = useState<string | null>(null);
  const [availableStatus, setAvailableStatus] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (userid) {
          setUserToken(userid as string);
          const apiUrl = `http://localhost:3000/api/user?userId=${userid}`;
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
    const fetchSVG = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/badge/${userid}`
        );
        const fetchedSvgContent = await response.text();
        setSvgContent(fetchedSvgContent);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserName();
    fetchSVG();
  }, [userid]);

  return (
    <Layout>
      <section className="min-h-screen w-full flex justify-center items-center">
        {availableStatus && (
          <div className="text-center">
            <h1 className="text-4xl font-bold rounded-sm text-zinc-100">
              hey @{userName}
            </h1>
            <p className="text-zinc-300">
              Maybe I'll try with other
              <span className="font-bold"> themes</span>,
            </p>
            <div className="">
              {svgContent && (
                // <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                <img src="http://localhost:3000/api/badge/31bx3nvidhujrgdrzx3xigrgm4wu" className="w-[400px] h-[180px]"></img>
              )}
            </div>

            <div className="flex flex-wrap w-full gap-2">
              <Link
                href="/api/auth"
                className="bg-[#00d351] mt-5 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 text-zinc-900 flex-1"
              >
                Copy API URL
              </Link>
              <Link
                href="/api/auth"
                className="bg-[#00d351] mt-5 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-4 text-zinc-900 flex-1"
              >
                Copy MD snippet
              </Link>
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
