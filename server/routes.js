const helpers = require("./helpers.js");
const path = require("path");

module.exports = express => {
  const router = express.Router();
  //? sends the task.json
  router.get("/paradigms/:task/", (req, res) => {
    const data = require(`./paradigms/${req.params.task}/task.json`);
    res.json(data);
  });
  //? sends the task.js
  //TODO Can probably wrap this up in /paradigms/:task
  router.get("/paradigms/:task/task", (req, res) => {
    res.sendFile(path.join(__dirname, `paradigms/${req.params.task}/task.js`));
  });
  //? Sends amplifier configuration
  router.get("/amplifiers/", (req, res) => {
    const data = require(`./Config/amplifiers.json`);
    res.json(data);
  });
  //?Sends local configuration
  router.get("/localconfig", (req, res) => {
    const data = require("./Config/localconfig.json");
    res.json(data);
  });
  //? Sends all paradigms
  router.get("/paradigms", (req, res) => {
    const cardPaths = helpers.findCards("./server/paradigms");
    const cards = cardPaths.map(cardPath => {
      const cardDir = path.dirname(cardPath);
      const cardDirParts = cardDir.split(path.sep);
      const cardRoot = cardDirParts.slice(cardDirParts.length - 2).join("/");
      const cardName = cardDirParts[cardDirParts.length - 1];
      return {
        name: cardName,
        path: cardPath,
        root: cardRoot
      };
    });
    res.send(cards);
  });
  //? Sends list of all unique subjects based on /data entries
  router.get("/subjects", (req, res) => {
    const dataPaths = helpers.findData("./data");
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    let subjects = dataPaths
      .map(x => {
        return x.split(path.sep).slice(x.split(path.sep).length - 3)[0];
      })
      .filter(onlyUnique);
    res.send(subjects);
  });
  //? Sends list of all unique tasks based on /data entries
  router.get("/api/:subj", (req, res) => {
    let subject = req.params.subj;
    const dataPaths = helpers.findData(`./data/${subject}`);
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    let tasks = dataPaths
      .map(x => {
        return x.split(path.sep).slice(x.split(path.sep).length - 2)[0];
      })
      .filter(onlyUnique);
    res.send(tasks);
  });
  //? Sends individual .dat files
  router.get("/api/:subj/:task", (req, res) => {
    let subject = req.params.subj;
    let task = req.params.task;
    const dataPaths = helpers.findData(`./data/${subject}/${task}`);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    let runs = dataPaths
      .map(x => {
        return x.split(path.sep).slice(x.split(path.sep).length - 1)[0];
      })
      .filter(onlyUnique);
    res.send(runs);
  });

  return router;
};
