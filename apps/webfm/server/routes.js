import path from "path";
import fs from "fs";
// import { promises as fsp } from "fs";
// import formidable from "formidable";
// import multer from "multer";
import pkg from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
const swaggerUi = pkg;
let __dirname = path.resolve(path.dirname(""));
let dataDir = process.env.dataDir || "../../data/";

// function rawBody(req, res, next) {
//   req.setEncoding("utf8");
//   req.rawBody = "";
//   req.on("data", (chunk) => (req.rawBody += chunk));
//   req.on("end", () => next());
// }

const routes = (express) => {
  const router = express.Router();

  //Sends configurations
  // router.get("/config", (req, res) =>
  //   res.sendFile(`${__dirname}/server/config.json`)
  // );
  router.use(
    "/docs_server",
    express.static(path.join(__dirname, "/docs", "/build"))
  );
  router.use(
    "/docs",
    express.static(path.join(__dirname, "/docs", "/build"))
  );

  router.use("/api-docs", swaggerUi.serve);
  router.get("/api-docs", swaggerUi.setup(swaggerDocument));






  // //* PUT routes

  // // Put new brain image data into .metadata
  // router.put("/api/brain/:subject", async (req, res) => {
  //   let subject = req.params.subject;
  //   if (!fs.existsSync(`./data/${subject}`)) {
  //     fs.mkdirSync(`./data/${subject}`);
  //     fs.mkdirSync(`./data/${subject}/info`);
  //     fs.mkdirSync(`./data/${subject}/data`);
  //     fs.mkdirSync(`./data/${subject}/data/HG`);
  //     fs.mkdirSync(`./data/${subject}/data/EP`);
  //     fs.mkdirSync(`./data/${subject}/data/Cortstim`);
  //   }
  //   var upload = multer({
  //     storage: multer.diskStorage({
  //       destination: (req, file, cb) => {
  //         cb(null, `./data/${req.params.subject}/info`);
  //       },
  //       filename: (req, file, cb) => {
  //         cb(null, `reconstruction${path.extname(file.originalname)}`);
  //       },
  //     }),
  //     limits: {
  //       fileSize: 100000000,
  //     },
  //   }).single("brainImage");
  //   upload(req, res, (err) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.send();
  //     }
  //   });
  // });

  // //Add a new geometry file
  // router.put("/api/geometry/:subject", async (req, res) => {
  //   let subject = req.params.subject;
  //   if (fs.existsSync(`./data/${subject}`)) {
  //     fs.writeFile(
  //       `./data/${req.params.subject}/info/channels.json`,
  //       JSON.stringify(req.body),
  //       (err) => {
  //         if (err) console.log(err);
  //       }
  //     );
  //     res.send("Geometry updated!");
  //   }
  // });

  // //Add a new subject
  // router.put("/api/data/:subject", rawBody, (req, res) => {
  //   let subject = req.params.subject;
  //   if (!fs.existsSync(`./data/${subject}`)) {
  //     fs.mkdir(`./data/${subject}`, () => {
  //       let metadata = {
  //         subject: subject,
  //       };
  //       if (req.rawBody != "") {
  //         let bodyData = {};
  //         bodyData = JSON.parse(req.rawBody);

  //         Object.assign(metadata, bodyData);
  //       }
  //       fs.writeFile(
  //         `./data/${subject}/.metadata`,
  //         JSON.stringify(metadata),
  //         (err) => res.sendStatus(201)
  //       );
  //     });
  //   }
  // });

  // //Add a new record
  // router.put("/api/data/:subject/:record", rawBody, (req, res) => {
  //   let subject = req.params.subject;
  //   let record = req.params.record;
  //   fs.writeFile(`./data/${subject}/${record}.fm`, req.rawBody, () =>
  //     res.sendStatus(201)
  //   );
  // });

  // //Notes
  // router.put("/api/:subject/notes", (req, res) => {
  //   console.log(req.body.note);
  //   fs.writeFile(
  //     `./data/${req.params.subject}/info/notes.txt`,
  //     req.body.note,
  //     (err) => console.log(err)
  //   );
  // });

  return router;
};
export default routes;
