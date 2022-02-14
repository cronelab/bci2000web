import fs from "fs";
let dataDir = process.env.dataDir || "/webfm/data/";

const dataRoutes = (express) => {
  const router = express.Router();

  //Send a list of high gamma records
  router.get("/api/records/HG/:subject", (req, res) => {
    let subject = req.params.subject;
    if (!fs.existsSync(`${dataDir}/${subject}/data/HG/`)) {
      fs.mkdirSync(`${dataDir}/${subject}/data/HG/`)
    }
    let _records = fs.readdirSync(`${dataDir}/${subject}/data/HG`);
    let records = _records.map((f) => f.split(".")[0]);
    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(204).end();
    }
  });

  //Send the actual HG record
  router.get("/api/data/HG/:subject/:record", (req, res) => {
    var subject = req.params.subject;
    var record = req.params.record;
    let filetoread = fs.readFileSync(
      `${dataDir}/${subject}/data/HG/${record}.json`,
      "utf8"
    );
    let recordData = JSON.parse(filetoread);
    res.status(200).send(JSON.stringify(recordData));
  });

  //Send a list of evoked potential records : EPs
  router.get("/api/records/EP/:subject/", (req, res) => {
    let subject = req.params.subject;
    if (!fs.existsSync(`${dataDir}/${subject}/data/EP/`)) {
      fs.mkdirSync(`${dataDir}/${subject}/data/EP/`)
    }
    let _records = fs.readdirSync(`${dataDir}/${subject}/data/EP`)
    let records = _records.map(file => {
      let splitFile = file.split("_ResponseInfo.json")[0]
      return `${splitFile.split("_")[1]}_${splitFile.split("_")[2]}_${splitFile.split("_")[3]}`
    })
    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(204).end();
    }
  });

  //Send a list of evoked potential records: CCSRs
  router.get("/api/records/CCSR/:subject/", (req, res) => {
    let subject = req.params.subject;
    if (!fs.existsSync(`${dataDir}/${subject}/data/CCSR/`)) {
      fs.mkdirSync(`${dataDir}/${subject}/data/CCSR/`)
    }
    let _records = fs.readdirSync(`${dataDir}/${subject}/data/CCSR`)
    let records = _records.map(file => {
      let splitFile = file.split("_ResponseInfo.json")[0]
      return `${splitFile.split("_")[1]}_${splitFile.split("_")[2]}_${splitFile.split("_")[3]}`
    })
    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(204).end();
    }
  });

  //Send the actual EP record
  router.get("/api/data/EP/:subject/:record/", (req, res) => {
    let subject = req.params.subject;
    let task = req.params.record;
    let resInfoFile = `${dataDir}/${subject}/data/EP/${subject}_${task}_ResponseInfo.json`;
    if (fs.existsSync(resInfoFile)) {
      let _result = JSON.parse(fs.readFileSync(resInfoFile, "utf8"));
      let significantChannels = {
        window: _result.window
      };
      Object.keys(_result.significant).forEach((x) => {
        if (_result.significant[x] == 1) {
          return (significantChannels[x] = {
            times: _result.time[x],
            zscores: _result.zscores[x].overall,
          });
          //
          // sigResponses[val] = { timeToPeak: _result.zscores[val].overall[0], peak: _result.zscores[val].overall[1] }
        }
      });
      res.send(significantChannels);
    }
  });

  //Send the actual CCSR record
  router.get("/api/data/CCSR/:subject/:record/", (req, res) => {
    let subject = req.params.subject;
    let task = req.params.record;
    let resInfoFile = `${dataDir}/${subject}/data/CCSR/${subject}_${task}_ResponseInfo.json`;
    if (fs.existsSync(resInfoFile)) {
      let _result = JSON.parse(fs.readFileSync(resInfoFile, "utf8"));
      let significantChannels = {};
      Object.keys(_result.highGamma.sscores).forEach((x) => {
        // if (_result.significant[x] == 1) {
        return (significantChannels[x] = {
          times: _result.highGamma.time[x],
          sscores: _result.highGamma.sscores[x],
          window: _result.highGamma.window
        });
        // sigResponses[val] = { timeToPeak: _result.zscores[val].overall[0], peak: _result.zscores[val].overall[1] }
        // }
      });
      res.send(significantChannels);
    }
    else {
      console.log("File doesn't exist")
    }
  });



  router.put("/api/data/cortstim/:subject", async (req, res) => {
    let { patientID, date, results } = req.body;
    if (!fs.existsSync(`${dataDir}/${patientID}/data/cortstim/cortstim.json`)) {
      let fileResults = [];
      fileResults.push(results);
      fs.appendFileSync(
        `${dataDir}/${patientID}/data/cortstim/cortstim.json`,
        JSON.stringify({
          patientID,
          date,
          results: [results],
        })
      );
      res.send(
        JSON.stringify({
          patientID,
          date,
          results: fileResults,
        })
      );
    }
    else {
      let fileData = fs.readFileSync(
        `${dataDir}/${patientID}/data/cortstim/cortstim.json`
      );
      let fileResults = JSON.parse(fileData).results;
      fileResults.push(results);
      fs.writeFileSync(
        `${dataDir}/${patientID}/data/cortstim/cortstim.json`,
        JSON.stringify({
          patientID,
          date,
          results: fileResults,
        }),
        { flag: "w" }
      );
      res.send(
        JSON.stringify({
          patientID,
          date,
          results: fileResults,
        })
      );
    }
  });
  router.get("/api/data/cortstim/:subject", async (req, res) => {
    let patientID = req.params.subject;
    if (fs.existsSync(`${dataDir}/${patientID}/data/cortstim/cortstim.json`)) {
      let fileData = fs.readFileSync(
        `${dataDir}/${patientID}/data/cortstim/cortstim.json`
      );
      res.send(JSON.parse(fileData))
    }
  })



  //Sends list of annotations 
  router.get("/api/annotations/:subject", (req, res) => {
    let subject = req.params.subject;
    fs.readdir(`${dataDir}/${subject}/data/annotations`, (err, images) => {
      if (images != undefined && images.length > 0) {
        res.send(JSON.stringify({ images: images }))
      } else {
        res.status(204).end();
      }
    });
  });
  //Sends annotations 
  router.get("/api/annotation/:subject/:annotation", (req, res) => {
    let subject = req.params.subject;
    let annotation = req.params.annotation;
    res.sendFile(`${annotation}.jpg`, {
      root: `${dataDir}/${subject}/data/annotations/`
    })
  });

  //Saves an annotation
  router.post("/api/annotation/:subject/", (req, res) => {
    if (!fs.existsSync(`${dataDir}/${req.params.subject}/data/annotations/`)) {
      fs.mkdirSync(`${dataDir}/${req.params.subject}/data/annotations/`)
    }
    fs.writeFileSync(`${dataDir}/${req.params.subject}/data/annotations/${req.files[0].originalname}`, req.files[0].buffer, {
      encoding: 'binary'
    })
    res.send(req.files[0].buffer)
  });


  router.get("/api/data/epilepsy/:subject", async (req, res) => {
    let patientID = req.params.subject;
    if (fs.existsSync(`${dataDir}/${patientID}/data/Epilepsy/test.json`)) {
      let fileData = fs.readFileSync(
        `${dataDir}/${patientID}/data/Epilepsy/test.json`
      );
      res.send(JSON.parse(fileData))
    }else {
      res.status(204).end();
    }
  })


  // //Send a list of CCSRs
  // router.get("/api/:subject/records/CCSR", (req, res) => {
  //   let subject = req.params.subject;
  //   fs.readdir(`./data/${subject}/data/CCSR`, (err, records) => {
  //     if (records != undefined) {
  //       let cleanRecords = records
  //         .filter((e) => path.extname(e) == ".json")
  //         .map((f) => f.split(".")[0]);
  //       let recordsToSend = cleanRecords.map((f) => {
  //         let split = f.split("_");
  //         return `${split[1]}_${split[2]}_${split[3]}`;
  //       });
  //       res.status(200).json(recordsToSend);
  //     } else {
  //       res.status(204).end();
  //     }
  //   });
  // });

  // //Send the actual CCSR record
  // router.get("/api/data/:subject/:record/CCSR", (req, res) => {
  //   let subject = req.params.subject;
  //   let task = req.params.record;
  //   const responseInfoPath = `./data/${subject}/data/CCSR`;
  //   let resInfoFile = `${responseInfoPath}/${subject}_${task}_CCSR_ResponseInfo.json`;
  //   if (fs.existsSync(resInfoFile)) {
  //     let _result = JSON.parse(fs.readFileSync(resInfoFile, "utf8"));

  //     let lgData = {
  //       frequencyBand: _result["lowGamma"]["frequencyBand"],
  //       sscore: _result["lowGamma"]["sscores"],
  //       times: _result["lowGamma"]["time"],
  //     };
  //     let hgData = {
  //       frequencyBand: _result["highGamma"]["frequencyBand"],
  //       sscore: _result["highGamma"]["sscores"],
  //       times: _result["highGamma"]["time"],
  //     };
  //     res.send({ lgData, hgData });
  //   }
  // });




  // //CCEP pictures
  // router.get("/api/data/:subject/ccepPics/:type/:param2", (req, res) => {
  //   let { subject, type, param2 } = req.params;
  //   let ccepFolder = `./data/${subject}/data/CCEPS`;
  //   if (type == "matrix") {
  //     if (param2 == "anatomical") {
  //       res.contentType("image/jpeg");

  //       res.sendFile(
  //         `${ccepFolder}/Adjacency_Matrices/${subject}_Anatomical_Location_Adjacency_Matrix.jpg`,
  //         { root: path.join(__dirname) }
  //       );
  //     } else if (param2 == "electrode") {
  //       res.contentType("image/jpeg");
  //       res.sendFile(
  //         `${ccepFolder}/Adjacency_Matrices/${subject}_Electrode_Adjacency_Matrix.jpg`,
  //         { root: path.join(__dirname) }
  //       );
  //     }
  //   } else if (type == "CCEPS") {
  //     let fileToSend = `${ccepFolder}/CCEP_Results/${subject}_${param2}.jpg`;
  //     res.sendFile(`${fileToSend}`, { root: path.join(__dirname) });
  //   } else if (type == "CCSR") {
  //     let fileToSend = `${ccepFolder}/CCSR_Results/${subject}_${param2}.jpg`;
  //     res.sendFile(`${fileToSend}`, { root: path.join(__dirname) });
  //   } else if (type == "list") {
  //     if (param2 == "all") {
  //       let adjMatrix = fs
  //         .readdirSync(`${ccepFolder}/Adjacency_Matrices`)
  //         .map((file) => file.split(`${subject}_`)[1]);
  //       let CCEPRes = fs
  //         .readdirSync(`${ccepFolder}/CCEP_Results`)
  //         .map((file) => file.split(`${subject}_`)[1])
  //         .map((file) => file.split(".jpg")[0])
  //         .filter((name) => !name.startsWith("All"))
  //         .filter((name) => !name.endsWith("Map"));
  //       let CCEPRes_Map = fs
  //         .readdirSync(`${ccepFolder}/CCEP_Results`)
  //         .map((file) => file.split(`${subject}_`)[1])
  //         .filter((name) => !name.startsWith("All"))
  //         .map((file) => file.split(".jpg")[0])
  //         .filter((name) => name.endsWith("Map"));
  //       let CCSRRes = fs
  //         .readdirSync(`${ccepFolder}/CCSR_Results`)
  //         .map((file) => file.split(`${subject}_`)[1])
  //         .map((file) => file.split(".jpg")[0]);
  //       res.send(
  //         JSON.stringify({
  //           matrices: [...adjMatrix],
  //           CCEP: [...CCEPRes],
  //           CCSR: [...CCSRRes],
  //         })
  //       );
  //       // console.log(files)
  //     }
  //   }
  // });

  return router;
};
export default dataRoutes;
