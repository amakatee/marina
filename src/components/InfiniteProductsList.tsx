import InfiniteScroll from "react-infinite-scroll-component"
import Link from "next/link"
import { api } from "~/utils/api"
import { useState } from "react";
import Image from 'next/image'

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





function ProductCard({ id, description, variants, images, createdAt} : Product) {

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
     console.log(colorValue)
     const [sizeValue, setSizeValue] = useState<string>()
     console.log(sizeValue)

    return <li className="flex gap-4 border-b px-4 py-4">
        <Link href={`/products/${id}`}>
            <p className="whitespace-pre-wrap">{description}</p>
        </Link>
        <button className="" onClick={() => {
            deleteProduct.mutate({id: id})
        }}>delete product</button>

        <div>{dateTimeFormatter.format(createdAt)}</div>
        <div>
           
              
                <div className="bg-[pink] flex flex-col gap-3">
                   <div className="flex gap-2"> {nonDuplicateColor?.map((color, i) => <div
                   key={i}  
                   className={colorValue === color ? `bg-[blue]` : `bg-[pink]`   }
            
                   onClick={() => {
                       setColorValue(color)
                       const currentVariant = variants?.filter(variant => variant.color === color)
                       setCurrentColorValue(currentVariant)
                   }}>{color}</div>)}</div>
                   <div className="flex gap-2">{nonDuplicateSize?.map((size, i) => <div 
                    key={i} 
                    className={sizeValue === size ? `bg-[blue]` : `bg-[pink]`}
                    onClick={() => {
                        setSizeValue(size)
                        console.log(size, sizeValue)
                        const currentVariant = variants?.filter(variant => variant.size === size)
                        setCurrentSizeValue(currentVariant)
                        

                   }}>{size}</div>)}</div>
                   <div>{qty1 && qty1 || 0}pieces</div>
                   <div>
                       {images?.map(image => <img key={image.fileKey} src={image.fileUrl} width={100}  alt="image" />)}
                   </div>
                   <div className="flex gap-2">{variants?.map((variant,i) => <div key={i}>{variant.qty}</div>)}</div>  
                </div>
        </div>
       


        
     

    </li>
}