import { useCallback, useState, useRef, useLayoutEffect } from "react"
import { Button } from "./Button"
import { useSession } from "next-auth/react"
import { api } from "~/utils/api"
import type { FormEvent } from "react"
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { arrayBuffer } from "stream/consumers"


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
    const [titleVal, setTitleVal] = useState("")
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
            setInputVal("")
            if(session.status !== "authenticated") return
            trpcUtils.product.infiniteFeed.setInfiniteData({}, (oldData) => {
                if (oldData == null || oldData.pages[0] == null) return;
                 const newCacheProduct = {
                  ...newProduct,
                  likeCount: 0,
                  user: {
                    id: session.data.user.id,
                    name: session.data.user.name || null,
                  },
                };
                return {
                  ...oldData,
                  pages: [
                    {
                      ...oldData.pages[0],
                      products: [newCacheProduct, ...oldData.pages[0].products],
                    },
                    ...oldData.pages.slice(1),
                  ],
                }})}})

    function handleSubmit( e: FormEvent) {
        e.preventDefault()
        createProduct.mutate({description: inputVal, title: "duhfuash", quantity: 3, price:"600"})
    }


    const VariationsInput = [{
      colorValue: "",
      sizeValue: "",
      qtyValue: ""
    }]
  
    const [variationsArr, setVariationsArr] = useState(VariationsInput)
    
    function addVariation() {
      const list = [...variationsArr, { colorValue:"", sizeValue:"", qtyValue:""}]
      setVariationsArr(list)
    }

    function removeVariation(i:number) {
      const list = [...variationsArr]
      list.splice(i, 1)
      setVariationsArr(list)
      return
    }
    
    function updateInputState (e: React.ChangeEvent<HTMLInputElement>, i:number) {
       const { name, value} = e.target
       const newArr = variationsArr.map((item, index) => {
         if(i === index) {
           return { ...item, [name]:value }
         } else {
           return item
         }})
       setVariationsArr(newArr)
      }
    
      return <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b py-2">
        <div className="flex flex-col gap-4 ">
            <p className="px-4">Create new product</p>
            <input
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            placeholder="Product title"
            className="flex-grow resize-none overflow-hidden px-4 text-lg outline-none"
            />
            <textarea 
            ref={inputRef}
            style={{height: 0}}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-grow resize-none overflow-hidden px-4 text-lg outline-none"
            placeholder="Product Description" 
            />
            
            <p> Add Products Variations</p>
              <div className="w-full bg-[pink] flex flex-col gap-3"> 
              {variationsArr.map((item, i) => (
                <div 
                key={i} 
                className="flex items-center justify-between"
                onClick={(e) => {
                  e.preventDefault()
                  console.log(variationsArr)
                }}>
                <input 
                className="resize-none overflow-hidden px-4 text-lg outline-none"
                name="sizeValue"
                placeholder="size"
                value={item.sizeValue}
                type="text"
                onChange={e => updateInputState(e, i)}
                />

                <input 
                className="resize-none overflow-hidden px-4 text-lg outline-none"
                name="colorValue"
                placeholder="color"
                value={item.colorValue}
                type="text"
                onChange={e => updateInputState(e, i)}

                />
                <input 
                className="resize-none overflow-hidden px-4 text-lg outline-none"
                name="qtyValue"
                placeholder="qty"
                value={item.qtyValue}
                type="text"
                onChange={e => updateInputState(e, i)}

                />
                <button className="p-2" onClick={addVariation}><AiOutlinePlus /></button>
                <button className="p-2" onClick={e => removeVariation(i)}><AiOutlineMinus /></button>
              </div>
              ))}
              <button type="submit">Save variations</button>
            </div>
        </div>

        <Button className="self-end">Save Product</Button>

    </form>
}


// https://www.cluemediator.com/add-or-remove-input-fields-dynamically-with-reactjs