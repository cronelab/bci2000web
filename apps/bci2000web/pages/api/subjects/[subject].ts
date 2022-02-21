//? Sends list of all unique tasks based on /data entries
import path from "path";
import helpers from "../../../server/helpers";
export default function handler(req, res) {
  const { subject } = req.query;
  const dataPaths = helpers.findData(`${process.cwd()}/data/${subject}`);

  function onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }
  let tasks = dataPaths
    .map((x) => {
      return x.split(path.sep).slice(x.split(path.sep).length - 2)[0];
    })
    .filter(onlyUnique);
  res.send(tasks);
}
