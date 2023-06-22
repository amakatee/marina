import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { MainNav } from "~/components/MainNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>
          Marina Store
        </title>
        <meta name="description" content="Beatiful things"/>
      </Head>
      <div>
        <MainNav />
        <div>
          <Component {...pageProps} />
        </div>
      </div>
  
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
