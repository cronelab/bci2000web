//? sends the task.json
import fs from "fs";
export default function handler(req, res) {
  const { task } = req.query;
  const data = JSON.parse(
    fs.readFileSync(
      `${process.cwd()}/server/paradigms/${task}/task.json`,
      "utf8"
    )
  );
  res.json(data);
}
