import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"
import { api } from "~/utils/api"
import { Variants} from "@prisma/client";
import { useState } from "react";
import { RequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
type Product = {
    id: string;
    title: string;
    quantity: number;
    price: string;
    description: string | null;
    variants: Variants[] | undefined
    createdAt: Date;
    // likeCount: number;
    user: { id: string, name: string | null}
}

type InfiniteProductsListProps = {
    isLoading: boolean,
    isError: boolean,
    hasMore: boolean  ,
    fetchNewProducts: () => Promise<unknown>,
    products: Product[] | undefined
}
export function InfiniteProductsList({products, isError, isLoading, hasMore = false, fetchNewProducts }: InfiniteProductsListProps) {
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





function ProductCard({ id, user, description, variants, createdAt} : Product) {
    const deleteProduct = api.product.deleteProduct.useMutation()
    
    const [currentColorValue, setCurrentColorValue] = useState<Variants[]>() 
    const [currentSizeValue, setCurrentSizeValue] = useState<Variants[]>()
    console.log(currentColorValue,  currentSizeValue)
    
  const result = currentColorValue?.filter((colorarr ) => {
      return currentSizeValue?.find((sizearr) => sizearr.color === colorarr.color && sizearr.size === colorarr.size)
  })
  console.log(result)
  const qty1 = result?.map(r => r?.qty)
  
    const colorVariants = variants?.map(variant => {
       return variant.color
   })
    const nonDuplicateColor = colorVariants?.filter((color, index) => colorVariants.indexOf(color) === index)
    const sizeVariants = variants?.map(variant => {
        return variant.size
    })
     const nonDuplicateSize = sizeVariants?.filter((size, index) => sizeVariants.indexOf(size) === index)
     const [style , setStyle] = useState("bg-pink") 
    

    return <li className="flex gap-4 border-b px-4 py-4">
        <Link href={`/products/${id}`}>
            <p className="whitespace-pre-wrap">{description}</p>
            <button onClick={() => deleteProduct.mutate({id: id})}>delete p</button>
        </Link>
        <div>{dateTimeFormatter.format(createdAt)}</div>
        <div>
           

                <div className="bg-[pink] flex flex-col gap-3">
                   <div className="flex gap-2"> {nonDuplicateColor?.map((color, i) => <div key={i} className={`${style}`} onClick={() => {
                    //    setStyle("bg-[blue]")
                    if(result?.map(r => r.qty === "0")) {
                        console.log("0")
                        setStyle("bg-[grey]")

                    } else if(result?.map(r => parseInt(r.qty) > 0)) {
                        console.log("1")
                        setStyle("bg-[green]")

                    }
    
                       const currentVariant = variants?.filter(variant => variant.color === color)
                       setCurrentColorValue(currentVariant)

                      
                       
                       
                   }}>{color}</div>)}</div>
                   <div className="flex gap-2">{nonDuplicateSize?.map((size, i) => <div key={i} onClick={() => {
                        const currentVariant = variants?.filter(variant => variant.size === size)
                        setCurrentSizeValue(currentVariant)
                        

                   }}>{size}</div>)}</div>
                   <div>{qty1 && qty1 || 0}pieces</div>
                   <div className="flex gap-2">{variants?.map(variant => <div>{variant.qty}</div>)}</div>  
                </div>
        </div>
       


        
     

    </li>
}