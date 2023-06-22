import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"

type Product = {
    id: string,
    content: string,
    createdAt: Date,
    likeCount: number,
    user: { id: string, name: string | null}
}

type InfiniteProductsListProps = {
    isLoading: boolean,
    isError: boolean,
    hasMore: boolean ,
    fetchNewProducts: () => Promise<unknown>,
    products: Product[] | undefined
}
export function InfiniteProductsList({products, isError, isLoading, hasMore, fetchNewProducts }: InfiniteProductsListProps) {
    if(isLoading) return <h1>Loading...</h1>
    if(isError) return <h1>Error ...</h1>
    if(products == null) return null

    if( products == null || products.length === 0 ) {
        return <h2>No products</h2>
    }

    return <ul>
        <InfiniteScroll
        dataLength={products.length}
        next={fetchNewProducts}
        hasMore={hasMore}
        loader={"Loading...."}
        >
            
            {products.map(product => {
               return <ProductCard key={product.id} {...product} />
            })}

        </InfiniteScroll>
    </ul>

}
const dateTimeFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "short"})

function ProductCard({ id, user, content, createdAt, likeCount} : Product) {
    return <li className="flex gap-4 border-b px-4 py-4">
        <Link href={`/products/${id}`}>
            <p className="whitespace-pre-wrap">{content}</p>
        </Link>
        <div>{dateTimeFormatter.format(createdAt)}</div>


        
     

    </li>
}