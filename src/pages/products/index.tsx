
import { api } from "~/utils/api";
import { NewProductForm } from "~/components/NewProductForm";
import { InfiniteProductsList } from "~/components/InfiniteProductsList";
import { useSession } from "next-auth/react";

function Products() {
    
  
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

export default Products
