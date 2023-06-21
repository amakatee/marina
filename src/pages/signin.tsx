import { getProviders, signIn } from "next-auth/react";
import { type AppProps } from "next/app";

import  { type GetServerSideProps } from "next";

export default function Signin({providers} : {providers: AppProps}) {

  return (
    <>
    <div>
        {Object.values(providers).map((provider) => (
            <button
            key={provider.id }
            onClick={() => void signIn(provider.id, {
                callbackUrl: `${window.location.origin}`
            })}
            >
                sign in with google

            </button>
        ))}
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const providers = await getProviders()
    return {
        props: { providers}
    }
}

