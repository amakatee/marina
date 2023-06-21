import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import type { GetServerSideProps } from "next";

export default function Signin({providers} : {providers: AppProps}) {

  return (
    <>
    <div>Sign in with google</div>
    <div>
        {Object.values(providers).map((provider) => (
            <button
            key={provider.id}
            onClick={() => signIn(provider.id, {
                callbackUrl: `${window.location.origin}`
            })}
            >
                sigin g

            </button>
        ))

        
     }
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

