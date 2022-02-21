//? Sends all paradigms
import fs from "fs";
import path from "path";
export default function handler(req, res) {
  //? Searches the server/paradigms folder or tasks to populate the UI's task field
  const findCards = (currentDirPath: string): string[] => {
    let cardPaths: string[] = [];
    fs.readdirSync(currentDirPath).forEach((name) => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && path.basename(filePath) == "task.json") {
        cardPaths.push(path.resolve(filePath));
      } else if (stat.isDirectory()) {
        cardPaths = cardPaths.concat(findCards(filePath));
      }
    });
    return cardPaths;
  };
  const cardPaths: string[] = findCards("./server/paradigms");
  const cards = cardPaths.map((cardPath: string) => {
    const cardDir = path.dirname(cardPath);
    const cardDirParts = cardDir.split(path.sep);
    const cardRoot = cardDirParts.slice(cardDirParts.length - 2).join("/");
    const cardName = cardDirParts[cardDirParts.length - 1];
    return {
      name: cardName,
      path: cardPath,
      root: cardRoot,
    };
  });
  res.send(cards);
}
