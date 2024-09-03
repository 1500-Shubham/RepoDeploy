import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: string) {
    // returned a promise which is awaited 
    // the await will be over once this promise is resolved or rejected 
    return new Promise((resolve) => {
         // us path gaye npm install and npm run build
         // exec build one child process
        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)

        // log us child process ka aa sakta hai
        // logs wahi node install wagera mein jo aata tha logs wahi yaha print
        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        // child process work done and when child exited then resolve karo
        child.on('close', function(code) {
           resolve("")
        });

    })

}