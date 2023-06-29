import { createUploadthing,  } from "uploadthing/next";
 
const f = createUploadthing();
 
const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async ({ req }) => {
       
        const user =  auth(req);
        if (!user) throw new Error("Unauthorized");
        return { userId: user.id };
      })

      .onUploadComplete( ({ metadata, file }) => {

        console.log("Upload complete for userId:", metadata.userId);
   
        console.log("file url", file.url);
      }),  
} 
 
export type OurFileRouter = typeof ourFileRouter;