import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: "50dffddf624ff1a6735ff7623596130e",
    secretAccessKey: "88d02674da7cf5f101e95b0bf51eb69d280f9ec2fe6ac924d31710bd5bfea138",
    endpoint: "https://d7a4c42a024029f72169ec6faf5cb79c.r2.cloudflarestorage.com"
})

// output/asdasd brings all files with prefix to locally 
export async function downloadS3Folder(prefix: string) {

    //1st list down all keys
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel-bucket",
        Prefix: prefix
    }).promise();
    // list keys jo us prefix ke under mein hai
    // 2nd ab un keys ko download karoge promise use karke manage kare hai

    // WhyConverting everything in promise taki function return na kare jab tak files na aaye
     
    // allFiles PromiseResult<S3.ListObjectsV2Output, AWSError>
    const allPromises = allFiles.Contents?.map(async ({Key}) => { //map similar forEach
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key); //users/dist/output/key
           
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){ ///users/dist/output/key if directory not exist
                fs.mkdirSync(dirName, { recursive: true }); //create it
            }
            // write stream create and read from s3
            // now dist->output->src->app.jsx yeh folder create ho gaye nahi hue toh
            const outputFile = fs.createWriteStream(finalOutputPath); //downloading from internet
            s3.getObject({ //reading file and output to output file which is capable to write
                Bucket: "vercel-bucket",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                // console.log("donwloaded that file")
                resolve("");
            })
        })
    }) || [] //if no conten then return empty array
    console.log("awaiting");

    // waiting till allPromises is completed tab yeh downloadS3 function exits
    // allPromise consiste of return new Promise
    // allPromise = [Promise,Promise]
    await Promise.all(allPromises?.filter(x => x !== undefined));
}


// SAME AS UPLOAD FILE--
export function copyFinalDist(id: string) {
    // after project build inside build folder 
    // /Users/shubham2.keshari/Documents/Vercel/main_app/deployService/dist/output/wyxm1/build/src/app.js
    const folderPath = path.join(__dirname, `output/${id}/build`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        // file is in my local
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
        //dist/${id} + src/app.js (came from folder ouput path)
    })

}
// locally jo folder path hai build ka waha se saare files path nikal raha
const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath); // convert filePath to actual file
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-bucket",
        Key: fileName, // yeh jo s3 mein jayega is key se
    }).promise();
    console.log(response);
}