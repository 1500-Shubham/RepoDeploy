
import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();


async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }), //just redis website syntax given
            'build-queue', // name of queue from where we will pull things out
            0
          );
        //   console.log(res); { key: 'build-queue', element: '123' }
        //   @ts-ignore; 
        const id = res.element 
        console.log(id);
        // await downloadS3Folder(`output/${id}`)
        // await buildProject(id); // promise aaya here then awaited
        // //@ts-ignore
        // await new Promise((resolve)=>{setTimeout(resolve,5000)})
        // copyFinalDist(id);

          //OR

        downloadS3Folder(`output/${id}`).then(()=>{
            buildProject(id) //1st build then /build ready then copy that to s3
                .then(() => {
                    copyFinalDist(id);
                }).then(()=>{
                    publisher.hSet("status", id, "deployed")
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                });
        })
        

        
          
    }
}
main();