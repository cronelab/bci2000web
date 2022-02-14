//? Sends list of all unique tasks based on /data entries
import fs from "fs";
export default function handler(req, res) {
  let { subject, task, block, comment, startTime, user, badChan } = req.body;
  let incomingData = `
        Subject: ${subject}
        Task: ${task}
        Block: ${block}
        Comments: ${comment}
        Start time: ${startTime}
        Researcher: ${user}
        Bad Channels: ${badChan}
        ----------------------------------
      `;

  if (!fs.existsSync(`${process.cwd()}/data/${subject}/${task}`)) {
    if (!fs.existsSync(`${process.cwd()}/data/${subject}`)) {
      fs.mkdirSync(`${process.cwd()}/data/${subject}`);
    }
    fs.mkdirSync(`${process.cwd()}/data/${subject}/${task}`);
  }
  fs.appendFile(
    `./data/${subject}/${task}/Notes.txt`,
    incomingData,
    (err) => {}
  );
}
