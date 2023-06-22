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
        content: true,
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
      products: data.map((product) => {
      return {
        id: product.id,
        content: product.content,
        createdAt: product.createdAt,
        likeCount: product._count.like,
        user: product.user,

      }
    }) , nextCursor}
  }),
  create: protectedProcedure
     .input(z.object({content: z.string()}))
     .mutation(async ({ input: { content }, ctx}) => {
       const product = await ctx.prisma.product.create({
         data: {content, userId: ctx.session.user.id}
        })
        return product
     })
 
});
