import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        //recursively call if that file is folder 
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
            // [1,2,3]=>  [a,b,c] aaya recursion se [1,2,3,a,b,c] net banao
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}