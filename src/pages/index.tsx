import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { NewProductForm } from "~/components/NewProductForm";
import { InfiniteProductsList } from "~/components/InfiniteProductsList";

function Home() {
  
  return (
    <>
     <NewProductForm />
     <RecentProducts />
     
    </>
  );

  
}
function RecentProducts () {
  const products = api.product.infiniteFeed.useInfiniteQuery({},
    {getNextPageParam: (lastPage) => lastPage.nextCursor})

  return <InfiniteProductsList 
  products={products.data?.pages.flatMap((page) => page.products)}
  isError={products.isError}
  isLoading={products.isLoading}
  hasMore={products.hasNextPage as boolean}
  fetchNewProducts={products.fetchNextPage}
  />
}

export default Home
