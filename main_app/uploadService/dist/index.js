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
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const file_1 = require("./file");
const aws_1 = require("./aws");
// REDIS initialization
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
const subscriber = (0, redis_1.createClient)(); //to get data from redis
subscriber.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // tells req.body is in json
//POSTMAN
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl; //github.com/shubham/appname
    const id = (0, utils_1.generate)(); // asd12
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    // all files user/dist/app.tsx user/dist/src/index.tsx user/dist/src/assets/some.png
    //recursively takes all files
    const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    // now upload these files to s3 
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        // x=12345 then x.slice(2) return 345 
        // for key /Users/shubham/vercel/dist/output/12312/src/App.jsx => output/12312/src/App.jsx trim kar rahe
        yield (0, aws_1.uploadFile)(file.slice(__dirname.length + 1), file);
    }));
    //@ts-ignore
    yield new Promise((resolve) => { setTimeout(resolve, 10000); });
    // wait for files to get uploaded
    //queue name in our case
    //Problem is this need to be present then only awake deploy service
    //Users/shubham2.keshari/Documents/Vercel/main_app/deployService/dist/output/n7bd6 
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded"); // set the status of the id 
    res.json({
        id: id
    });
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield subscriber.hGet("status", id);
    res.json({
        status: response
    });
}));
app.listen(3000, () => {
    console.log("Listening");
});
