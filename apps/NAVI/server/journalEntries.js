import { readFile, readdir } from 'fs/promises';

const routes = (express) => {
  const router = express.Router();

  router.get('/journal/:entry', async (req, res) => {
    let file = await readFile(`./data/journal/${req.params.entry}.json`);
    res.send(JSON.parse(file));
  });

  router.get('/journalentries', async (req, res) => {
    let dir = await readdir(`./data/journal/`);
    res.send(dir);
    // res.send(JSON.parse(file));
  });

  return router;
};
export default routes;
