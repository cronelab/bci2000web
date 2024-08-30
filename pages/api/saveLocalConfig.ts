//? updates the localconfig.json
import fs from "fs";

export default function handler(req, res) {
  //first create directory
  const path = `${process.cwd()}/server/Config/localconfig.json`; 
  fs.access(path, (error) => { 
    //then create json
    console.log(req.query)
    fs.writeFile(path, JSON.stringify(req.body, null, 2), err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
          console.log("local config updated")
        }})
  });
}