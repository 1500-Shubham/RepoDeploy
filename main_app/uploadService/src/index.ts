import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
// REDIS initialization
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient(); //to get data from redis
subscriber.connect();

const app = express();
app.use(cors())
app.use(express.json()); // tells req.body is in json
//POSTMAN
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl; //github.com/shubham/appname
    const id = generate(); // asd12
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    // all files user/dist/app.tsx user/dist/src/index.tsx user/dist/src/assets/some.png
    //recursively takes all files
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    // now upload these files to s3 
    files.forEach(async file => {
        // x=12345 then x.slice(2) return 345 
        // for key /Users/shubham/vercel/dist/output/12312/src/App.jsx => output/12312/src/App.jsx trim kar rahe
        await uploadFile(file.slice(__dirname.length + 1), file);
    })
    //@ts-ignore
    await new Promise((resolve)=>{setTimeout(resolve,10000)})
    // wait for files to get uploaded
    //queue name in our case

    //Problem is this need to be present then only awake deploy service
    //Users/shubham2.keshari/Documents/Vercel/main_app/deployService/dist/output/n7bd6 


    publisher.lPush("build-queue", id);

    publisher.hSet("status", id, "uploaded"); // set the status of the id 
    res.json({
        id:id
    })

});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000,()=>{
    console.log("Listening")
});