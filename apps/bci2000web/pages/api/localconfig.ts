//?Sends local configuration
import helpers from "../../server/helpers";
import path from "path";
import fs from "fs";
export default function handler(req, res) {
  const data = JSON.parse(
    fs.readFileSync(`${process.cwd()}/server/Config/localconfig.json`, "utf8")
  );
  res.json(data);
}
