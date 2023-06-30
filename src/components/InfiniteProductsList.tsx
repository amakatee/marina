import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"
import { api } from "~/utils/api"
import { useState } from "react";

type Variant = {
    color: string;
    size: string;
    qty: number;
}
type Images = {
    fileUrl: string,
    fileKey: string
}
type Product = {
    id: string;
    title: string;
    quantity: number;
    price: string;
    description: string | null;
    images: Images[] | undefined,
    variants: Variant[] | undefined
    createdAt: Date;
    likeCount?: number;
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

    


    return <ul className=" ">
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





function ProductCard({ id,title,  variants, images, createdAt} : Product) {

    const trpcUtils = api.useContext()
    const deleteProduct = api.product.deleteProduct.useMutation(
        {onSuccess: async () => {
        await trpcUtils.product.invalidate()}})
    
    const [currentColorValue, setCurrentColorValue] = useState<Variant[]>() 
    const [currentSizeValue, setCurrentSizeValue] = useState<Variant[]>()
    const result = currentColorValue?.filter((colorarr ) => {
      return currentSizeValue?.find((sizearr) => sizearr.color === colorarr.color && sizearr.size === colorarr.size)
  })
    const qty1 = result?.map(r => r?.qty)
    const colorVariants = variants?.map(variant => {
       return variant.color
   })
    const nonDuplicateColor = colorVariants?.filter((color, index) => colorVariants.indexOf(color) === index)
    const sizeVariants = variants?.map(variant => {
        return variant.size
    })
    const nonDuplicateSize = sizeVariants?.filter((size, index) => sizeVariants.indexOf(size) === index)
    const [colorValue, setColorValue] = useState<string>()
    const [sizeValue, setSizeValue] = useState<string>()
    

    return <li className="flex gap-4 border-b px-4 py-4">
       
       
         <div className=" h-auto flex flex-col items-center justify-between gap-3">
         <Link href={`/products/${id}`}>
            <p className="whitespace-pre-wrap">{title}</p>
        </Link>
            {images &&  <img  className="w-[8rem]" alt="image" src={images[0]?.fileUrl}/>} 
        </div>
       
        <div className="flex flex-col justify-between gap-2 ">
           <div className=" flex flex-col gap-3">
                   <div className="flex gap-2"> {nonDuplicateColor?.map((color, i) => <div
                   key={i}  
                   className={colorValue === color ? `bg-[black] text-white p-2 text-sm` : `bg-[white] text-sm border-[1px] border-zinc-800  p-2`   }
            
                   onClick={() => {
                       setColorValue(color)
                       const currentVariant = variants?.filter(variant => variant.color === color)
                       setCurrentColorValue(currentVariant)
                   }}>{color}</div>)}</div>
                   <div className="flex gap-2">{nonDuplicateSize?.map((size, i) => <div 
                    key={i} 
                    className={sizeValue === size ?  `bg-[black] text-white p-2 text-sm` : `bg-[white] text-sm border-[1px] border-zinc-800  p-2`}
                    onClick={() => {
                        setSizeValue(size)
                        console.log(size, sizeValue)
                        const currentVariant = variants?.filter(variant => variant.size === size)
                        setCurrentSizeValue(currentVariant)
                        

                   }}>{size}</div>)}</div>
                   <div>{qty1 && qty1 || 0} qty</div>
                  
                </div>
                <div>{dateTimeFormatter.format(createdAt)}</div>
                <button className="" onClick={() => {
                     deleteProduct.mutate({id: id})
                  }}>delete product</button>
        </div>
       


        
     

    </li>
}