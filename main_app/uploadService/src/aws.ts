import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "50dffddf624ff1a6735ff7623596130e",
    secretAccessKey: "88d02674da7cf5f101e95b0bf51eb69d280f9ec2fe6ac924d31710bd5bfea138",
    endpoint: "https://d7a4c42a024029f72169ec6faf5cb79c.r2.cloudflarestorage.com"
})

// fileName => output/12312/src/App.jsx
// output->12312->src->file
//this fileName will be in folder structure at cloudfare automatically
// filePath => /Users/shubham/vercel/dist/output/12312/src/App.jsx

// uploadFile("output/liv88/package.json","/Users/shubham2.keshari/Documents/Vercel/main_app/uploadService/dist/output/liv88/package.json")
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath); //from that file storing it in filecontent
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-bucket",
        Key: fileName,
    }).promise(); // new way to convert callback function into promise based
    console.log(response);
}
// can use this also
// return new Promise((resolve, reject) => {
//     s3.upload({
//         Body: fileContent,
//         Bucket: bucketName,
//         Key: fileName,
//     }, (err, data) => {
//         if (err) {
//             reject(err);  // Handle the error case
//         } else {
//             resolve(data);  // Handle the success case // now this data will be pased
//         }
//     });
// });
// const response = await uploadFileToS3(fileContent, bucketName, fileName);