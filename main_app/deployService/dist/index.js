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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const aws_1 = require("./aws");
const utils_1 = require("./utils");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), //just redis website syntax given
            'build-queue', // name of queue from where we will pull things out
            0);
            //   console.log(res); { key: 'build-queue', element: '123' }
            //   @ts-ignore; 
            const id = res.element;
            console.log(id);
            // await downloadS3Folder(`output/${id}`)
            // await buildProject(id); // promise aaya here then awaited
            // //@ts-ignore
            // await new Promise((resolve)=>{setTimeout(resolve,5000)})
            // copyFinalDist(id);
            (0, aws_1.downloadS3Folder)(`output/${id}`).then(() => {
                (0, utils_1.buildProject)(id) //1st build then /build ready then copy that to s3
                    .then(() => {
                    (0, aws_1.copyFinalDist)(id);
                }).then(() => {
                    publisher.hSet("status", id, "deployed");
                })
                    .catch((error) => {
                    console.error('An error occurred:', error);
                });
            });
        }
    });
}
main();
