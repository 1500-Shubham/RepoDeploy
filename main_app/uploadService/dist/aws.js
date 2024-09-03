"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "50dffddf624ff1a6735ff7623596130e",
    secretAccessKey: "88d02674da7cf5f101e95b0bf51eb69d280f9ec2fe6ac924d31710bd5bfea138",
    endpoint: "https://d7a4c42a024029f72169ec6faf5cb79c.r2.cloudflarestorage.com"
});
// fileName => output/12312/src/App.jsx
// output->12312->src->file
//this fileName will be in folder structure at cloudfare automatically
// filePath => /Users/shubham/vercel/dist/output/12312/src/App.jsx
// uploadFile("output/liv88/package.json","/Users/shubham2.keshari/Documents/Vercel/main_app/uploadService/dist/output/liv88/package.json")
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(localFilePath); //from that file storing it in filecontent
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "vercel-bucket",
        Key: fileName,
    }).promise(); // new way to convert callback function into promise based
    console.log(response);
});
exports.uploadFile = uploadFile;
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
