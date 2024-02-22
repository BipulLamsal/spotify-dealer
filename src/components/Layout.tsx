import React, { FC } from "react";
export type Props = { children: React.ReactNode };
const Layout: FC<Props> = ({ children }): React.ReactNode => {
  return (
    <div>
      <main className="w-full min-h-screen bg-zinc-950 px-2 py-5">
        {children}
      </main>
    </div>
  );
};
export default Layout;
