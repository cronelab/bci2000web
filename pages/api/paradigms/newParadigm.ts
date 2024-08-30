//? sends the task.json
import fs from "fs";

export default function handler(req, res) {
  //first create directory
  const path = `${process.cwd()}/server/paradigms/${req.query.name}`; 
  fs.access(path, (error) => { 
    // To check if the given directory  
    // already exists or not 
    if (error) { 
      // If current directory does not exist 
      // then create it 
      fs.mkdir(path, (error) => { 
        if (error) { 
          console.log(error); 
        } else { 
          console.log("New Directory created successfully !!"); 
        } 
      }); 
    } else { 
      console.log("Given Directory already exists !!"); 
    } 
    //then create json
    fs.writeFile(path + '/task.json', JSON.stringify(req.body, null, 2), err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
          console.log("successful")
        }})
  });
  //const task = req.data;
  //const { task } = req.query;
  //res = task;
}