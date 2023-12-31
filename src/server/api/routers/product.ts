import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";


export const productRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
  .input(
    z.object({
    limit: z.number().optional(),
    cursor: z.object({ id: z.string(), createdAt:z.date()}).optional()
  }))
  .query(
    async ({input: {limit = 10, cursor}, ctx}) => {
    const data = await ctx.prisma.product.findMany({
      take: limit + 1,
      cursor: cursor ? { createdAt_id: cursor} : undefined,
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      select: {
        id:true,
        title: true,
        price:true,
        quantity:true,
        description: true,
        images: {select: {fileKey: true, fileUrl: true}},
        variants: { select: { color: true, size: true, qty: true, }},
        createdAt:true,
        _count: {select: {like:true}},
        user: {
          select: {name: true, id: true}
        }
      }
    })
    let nextCursor: typeof cursor | undefined
    if (data.length > limit){
      const nextItem = data.pop()
      if(nextItem != null ) {
        nextCursor = {id: nextItem.id, createdAt: nextItem.createdAt }
      }
   
    }
    return {
      products: data.map((product) => {console.log(product)
      return {
        id: product.id,
        title: product.title,
        quantity: product.quantity,
        price: product.price,
        description: product.description,
        images: product.images,
        variants: product.variants,
        createdAt: product.createdAt,
        likeCount: product._count.like,
        user: product.user,


      }
    }) , nextCursor}
  }),
  create: protectedProcedure
     .input(z.object({
       description: z.string(), 
       title: z.string(), 
       price: z.string(), 
       quantity: z.number(),
       images: z.array(z.object({ fileUrl: z.string(), fileKey: z.string()})).optional(),
       variants: z.array(z.object({ color: z.string(),
       size: z. string(),
       qty: z.number(),
      
      })) 
      }))
     .mutation(async ({ input: { description , title, price, variants, quantity , images}, ctx}) => {
       console.log(variants)

       const product = await ctx.prisma.product.create({
         data: {description,
          price, 
          quantity ,
          title ,
          images: {create: images},
          variants: {create: variants}, 
          userId: ctx.session.user.id}
        })
        return product
     }),


  deleteProduct: protectedProcedure
     .input(
       z.object({
         id: z.string()
       }))
     .mutation(async({input, ctx}) => {
       try {
        return await ctx.prisma.product.delete({
          where: {
            id: input.id
          }
        })
       } catch (error) {
         console.log(error) 
        }
     })
 
 });
 
 
