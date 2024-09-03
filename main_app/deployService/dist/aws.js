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
exports.copyFinalDist = exports.downloadS3Folder = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "50dffddf624ff1a6735ff7623596130e",
    secretAccessKey: "88d02674da7cf5f101e95b0bf51eb69d280f9ec2fe6ac924d31710bd5bfea138",
    endpoint: "https://d7a4c42a024029f72169ec6faf5cb79c.r2.cloudflarestorage.com"
});
// output/asdasd brings all files with prefix to locally 
function downloadS3Folder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        //1st list down all keys
        const allFiles = yield s3.listObjectsV2({
            Bucket: "vercel-bucket",
            Prefix: prefix
        }).promise();
        // list keys jo us prefix ke under mein hai
        // 2nd ab un keys ko download karoge promise use karke manage kare hai
        // WhyConverting everything in promise taki function return na kare jab tak files na aaye
        // allFiles PromiseResult<S3.ListObjectsV2Output, AWSError>
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map((_b) => __awaiter(this, [_b], void 0, function* ({ Key }) {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (!Key) {
                    resolve("");
                    return;
                }
                const finalOutputPath = path_1.default.join(__dirname, Key); //users/dist/output/key
                const dirName = path_1.default.dirname(finalOutputPath);
                if (!fs_1.default.existsSync(dirName)) { ///users/dist/output/key if directory not exist
                    fs_1.default.mkdirSync(dirName, { recursive: true }); //create it
                }
                // write stream create and read from s3
                // now dist->output->src->app.jsx yeh folder create ho gaye nahi hue toh
                const outputFile = fs_1.default.createWriteStream(finalOutputPath); //downloading from internet
                s3.getObject({
                    Bucket: "vercel-bucket",
                    Key
                }).createReadStream().pipe(outputFile).on("finish", () => {
                    // console.log("donwloaded that file")
                    resolve("");
                });
            }));
        }))) || []; //if no conten then return empty array
        console.log("awaiting");
        // waiting till allPromises is completed tab yeh downloadS3 function exits
        // allPromise consiste of return new Promise
        // allPromise = [Promise,Promise]
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter(x => x !== undefined));
    });
}
exports.downloadS3Folder = downloadS3Folder;
// SAME AS UPLOAD FILE--
function copyFinalDist(id) {
    // after project build inside build folder 
    // /Users/shubham2.keshari/Documents/Vercel/main_app/deployService/dist/output/wyxm1/build/src/app.js
    const folderPath = path_1.default.join(__dirname, `output/${id}/build`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        // file is in my local
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
        //dist/${id} + src/app.js (came from folder ouput path)
    });
}
exports.copyFinalDist = copyFinalDist;
// locally jo folder path hai build ka waha se saare files path nikal raha
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(localFilePath); // convert filePath to actual file
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "vercel-bucket",
        Key: fileName, // yeh jo s3 mein jayega is key se
    }).promise();
    console.log(response);
});
