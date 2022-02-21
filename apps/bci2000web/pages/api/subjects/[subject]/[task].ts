//? Sends individual .dat files
import path from "path";
import helpers from "../../../../server/helpers";
export default function handler(req, res) {
  const { subject, task } = req.query;
  const dataPaths = helpers.findData(
    `${process.cwd()}/data/${subject}/${task}`
  );

  function onlyUnique(value: any, index: any, self: string | any[]) {
    return self.indexOf(value) === index;
  }
  let runs = dataPaths
    .map((x) => {
      return x.split(path.sep).slice(x.split(path.sep).length - 1)[0];
    })
    .filter(onlyUnique);
  res.send(runs);
}
