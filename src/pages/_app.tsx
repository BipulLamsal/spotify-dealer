import "tailwindcss/tailwind.css";
import React, { FC } from "react";
type Components = {
  Component: React.ElementType;
  pageProps: Object;
};

const MyApp: FC<Components> = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps}></Component>
    </>
  );
};
export default MyApp;
