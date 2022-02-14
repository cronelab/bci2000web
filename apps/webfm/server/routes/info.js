import path from "path";
import fs from "fs";
import parse from "csv-parse/lib/sync.js";

let __dirname = path.resolve(path.dirname(""));
let dataDir = process.env.dataDir || "/webfm/data/";
console.log(dataDir)

const infoRoutes = (express) => {
  const router = express.Router();

  /**
 * Return the ratio of the inline text length of the links in an element to
 * the inline text length of the entire element.
 *
 * @param {Node} node - Types or not: either works.
 * @throws {PartyError|Hearty} Multiple types work fine.
 * @returns {Number} Types and descriptions are both supported.
 */
  const list = (req, res) => {
    fs.readdir(dataDir, (err, subjects) => {
      if (subjects != undefined) {
        res.status(200).json(subjects.filter((f) => f != ".gitignore"))
      }
      else {
        res.status(200).json(["No subjects in database"]);
      }
    });
  }
  router.get("/api/list", list);

  //Sends 2D brain
  router.get("/api/brain/2D/:subject", (req, res) => {
    let subject = req.params.subject;
    fs.readdir(dataDir, (err, subjects) => {
      if (subjects != undefined) {
      if (subjects.indexOf(subject) > -1) {
        if (fs.existsSync(`${dataDir}/${subject}/info/reconstruction.jpg`)) {
          res.sendFile(`reconstruction.jpg`, {
            root: `${dataDir}/${subject}/info/`,
          });
        }
        else {
          res.sendFile(`nullrecon.png`, {
            root: `${dataDir}/`,
          });
        }
      } else {
        res.status(204).end();
      }
    }
    });
  });

  //Anatomical locations
  router.get("/api/anatomy/:subject", (req, res) => {
    let subject = req.params.subject;
    fs.readdir(dataDir, (err, subjects) => {
      if (subjects.indexOf(subject) > -1) {
        if (fs.existsSync(`${dataDir}/${subject}/info/anatomicalLabels.tsv`)) {
          let file = fs.readFileSync(
            `${dataDir}/${subject}/info/anatomicalLabels.tsv`
          );
          let anatomy = parse(file, {
            delimiter: ["\t"],
          });
          anatomy.shift();
          res.send(JSON.stringify(anatomy))
        }
        else {
          res.status(204).end();

        }
      }
    });
  });

  //Sends 2D geometry
  router.get("/api/geometry/2D/:subject", (req, res) => {
    let subject = req.params.subject;
    fs.readdir(dataDir, (err, subjects) => {
      if (subjects.indexOf(subject) > -1) {
        if (fs.existsSync(`${dataDir}/${subject}/info/channels.json`)) {
          res.sendFile(`channels.json`, {
            root: `${dataDir}/${subject}/info`,
          });
        }
      } else {
        let sensorGeometry = {
          placeHolder: {
            u: 0.0,
            v: 0,
          },
        };
        res.send(JSON.stringify(sensorGeometry));
      }
    });
  });

  //3D geometry
  router.get("/api/geometry/3D/:subject", (req, res) => {
    let subject = req.params.subject;
    if (fs.existsSync(`${dataDir}/${subject}/info/electrodes.glb`)) {
      console.log(`Sending ${subject}'s electrodes...`);
      res.sendFile(`electrodes.glb`, {
        root: `${dataDir}/${subject}/info`,
      });
    }
  });

  //3D brain
  router.get("/api/brain/3D/:subject", (req, res) => {
    let subject = req.params.subject;
    if (fs.existsSync(`${dataDir}/${subject}/info/brain.glb`)) {
      console.log(`Sending ${subject}'s brain...`);
      res.sendFile(`brain.glb`, {
        root: `${dataDir}/${subject}/info`,
      });
    }
  });

  //T1
  router.get("/api/T1/:subject/", (req, res) => {
    let subject = req.params.subject;
    if (fs.existsSync(`${dataDir}/${subject}/info/reconstruction.nii`)) {
      res.sendFile(`reconstruction.nii`, {
        root: `${dataDir}/${subject}/info`,
      });
    } else {
      res.status(204).end();
    }
  });

  return router;
};
export default infoRoutes;
