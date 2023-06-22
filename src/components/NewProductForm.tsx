import { useCallback, useState, useRef, useLayoutEffect } from "react"
import { Button } from "./Button"
import { useSession } from "next-auth/react"
import { api } from "~/utils/api"
import type { FormEvent } from "react"
function updateTextAreaSize(textArea? : HTMLTextAreaElement){
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

// export function NewProductForm() {
//     const session = useSession()
//     if(session.status !== " authenticated") return 

//     return <Form />
// }

export function NewProductForm() {
    const session = useSession()
    const [inputVal, setInputVal] = useState("") 
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea)
        textAreaRef.current = textArea
    }, [])
    
    const trpcUtils = api.useContext()
    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current)
    }, [inputVal])

    const createProduct = api.product.create.useMutation({
        onSuccess: newProduct => {
            console.log(newProduct)
            setInputVal("")
            
            if(session.status !== "authenticated") return
            // trpcUtils.product.infiniteFeed.setInfiniteData({}, (oldData : any  ) => {
            //     console.log(oldData, oldData.pages[0])
            //     if(oldData == null || oldData?.pages == null) return 

            //     const newCacheProduct = {
            //         ...newProduct,
            //         likeCount: 0,
            //         user: {
            //             id: session.data.user.id,
            //             name: session.data.user.name || null
            //         }
            //     }
            //     return {
            //         ...oldData,
            //         pages: [
            //             {
            //                 ...oldData.pages[0],
            //                 products: [newCacheProduct, ...oldData.pages[0].products]
 
            //             },
            //             //   ...oldData.pages.slice[1]
            //         ]

            //     }
            // } )

           
      
           
        }})
    function handleSubmit( e: FormEvent) {
        e.preventDefault()
        createProduct.mutate({content: inputVal})
    }

    return <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b py-2">
        <div className="flex gap-4 ">
            <textarea 
            ref={inputRef}
            style={{height: 0}}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="Product Description" />
        </div>
        <Button className="self-end">Save Product</Button>

    </form>
}