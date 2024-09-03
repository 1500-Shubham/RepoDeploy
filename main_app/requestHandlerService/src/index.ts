import express from "express";
import cors from "cors";
import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: "50dffddf624ff1a6735ff7623596130e",
    secretAccessKey: "88d02674da7cf5f101e95b0bf51eb69d280f9ec2fe6ac924d31710bd5bfea138",
    endpoint: "https://d7a4c42a024029f72169ec6faf5cb79c.r2.cloudflarestorage.com"
})


const app = express();
app.use(cors())
app.use(express.json()); // tells req.body is in json
//POSTMAN
app.get("/*", async (req, res) => {
    //wyxm1.shubham.com:3001/index.html
    const host = req.hostname;

    const id = host.split(".")[0];
    console.log(id);
    const filePath = req.path; 
    console.log(filePath);
    //id will be s3 id inside dist/id/files
    //req.path= index.html dega

    const contents = await s3.getObject({
        Bucket: "vercel-bucket",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type); // setting res returning content type
    // if not set type of res then it will get downloaded
    res.send(contents.Body); 
    // res.send("Hi");

})


app.listen(3001,()=>{
    console.log("Listening")
});