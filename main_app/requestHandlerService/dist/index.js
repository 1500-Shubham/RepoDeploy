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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    accessKeyId: "50dffddf624ff1a6735ff7623596130e",
    secretAccessKey: "88d02674da7cf5f101e95b0bf51eb69d280f9ec2fe6ac924d31710bd5bfea138",
    endpoint: "https://d7a4c42a024029f72169ec6faf5cb79c.r2.cloudflarestorage.com"
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // tells req.body is in json
//POSTMAN
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //wyxm1.shubham.com:3001/index.html
    const host = req.hostname;
    const id = host.split(".")[0];
    console.log(id);
    const filePath = req.path;
    console.log(filePath);
    //id will be s3 id inside dist/id/files
    //req.path= index.html dega
    const contents = yield s3.getObject({
        Bucket: "vercel-bucket",
        Key: `dist/${id}${filePath}`
    }).promise();
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type); // setting res returning content type
    // if not set type of res then it will get downloaded
    res.send(contents.Body);
    // res.send("Hi");
}));
app.listen(3001, () => {
    console.log("Listening");
});
