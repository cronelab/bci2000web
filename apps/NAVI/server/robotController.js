import VMPL from 'vMPL.js';
import path from 'path';
import child_process from 'child_process';
let __dirname = path.resolve(path.dirname(''));

const sleep = (ms) => {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
};

const vMPLRouter = (express) => {
  const router = express.Router();

  router.get('/moverobot', async (req, res) => {
    // let file = await readFile(`./server/bciConfig.json`);
    // res.send(JSON.parse(file));

    let leftArm = new VMPL('left', '10.194.224.12');
    let rightArm = new VMPL('right', '10.194.224.12');

    (async () => {
      leftArm.fist();
      await sleep(2000);
      leftArm.palmDown();
      await sleep(2000);
      rightArm.fist();
      await sleep(2000);
      rightArm.waveLeft();
      await sleep(2000);
      rightArm.waveRight();
      await sleep(2000);
      rightArm.peace();
    })();
    res.send(
      JSON.stringify({
        state: 'success',
      })
    );
  });

  return router;
};
export default vMPLRouter;
