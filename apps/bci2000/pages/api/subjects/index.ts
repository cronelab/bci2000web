//? Sends list of all unique subjects based on /data entries
import helpers from "../../../server/helpers";
import path from "path";
export default function handler(req, res) {
  const dataPaths = helpers.findData(`${process.cwd()}/data`);

  function onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }
  let subjects = dataPaths
    .map((x) => {
      return x.split(path.sep).slice(x.split(path.sep).length - 3)[0];
    })
    .filter(onlyUnique);
  res.send(subjects);
}
