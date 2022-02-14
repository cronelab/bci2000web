import { BCI2K_OperatorConnection } from "./dist/index.js";
let bci = new BCI2K_OperatorConnection();
(async () => {
    try{
        await bci.connect("ws://localhost:3000")
        console.log('connected')
        // bci.showWindow()
        // bci.execute("GET SYSTEM STATE")
        // await bci.startExecutable("SignalGenerator")
        // await bci.resetSystem();
        // await bci.startDummyRun();
        let v = bci.getVersion()
        // let name = await bci.execute("Stop");
        console.log(v)
    }
    catch(e){
        console.log(e)
    }

})()
