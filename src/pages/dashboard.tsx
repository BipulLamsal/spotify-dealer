import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

const Dashboard: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div>
      <h1>Spotify Dashboard</h1>
      {userData && (
        <div>
          <p>Welcome, {userData.display_name}!</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// Server-side props to pass access token to the component
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { access_token } = query;
  return { props: { accessToken: access_token || "" } };
};
