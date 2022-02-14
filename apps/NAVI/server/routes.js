import path from 'path';
import child_process from 'child_process';
let __dirname = path.resolve(path.dirname(''));
import { readFile } from 'fs/promises';
import twilio from 'twilio';

const routes = (express) => {
  const router = express.Router();
  // router.get('/', (req, res) =>
  //   res.sendFile(path.join(__dirname, '/dist', '/index.html'))
  // );

  router.get('/startbci', (req, res) => {
    child_process.exec(
      'C:\\Users\\User\\Desktop\\BCI2000\\bci2000web\\START.bat',
      {
        cwd: 'C:\\Users\\User\\Desktop\\BCI2000\\bci2000web',
      },
      function (error, stdout, stderr) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
      }
    );
    res.send(JSON.stringify('starting'));
  });

  router.get('/getbciconfig', async (req, res) => {
    let file = await readFile(`./server/configs/bciConfig.json`);
    res.send(JSON.parse(file));
  });

  router.use('/docs', express.static(path.join(__dirname, '/docs/html')));

  router.get('/textCaregiver', (req, res) => {
    const accountSid = 'AC8b368d55fc9c2101200b72f23bfb5c2e';
    const authToken = '4cb5a82ee7dfa1a5a0867ed8065294fe';
    const client = twilio(accountSid, authToken);

    client.messages
      .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+15407098607',
        to: '+18455194848',
      })
      .then((message) => {
        res.send("Message sent!")
        console.log(message.sid)
      });
  });

  return router;
};
export default routes;
