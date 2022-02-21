// bciController.ts
/**
 *
 * @module
 */
import * as BCI2K from 'bci2k';
import { BCI2K_OperatorConnection } from 'bci2k';

/**
 * Will change the border color on a selectable element between red and white
 * @category BCI Utilities
 * @returns the bciOperatorConnection
 */
const connectToBCIOperator = async (): Promise<BCI2K_OperatorConnection> => {
  let bciOperatorConn = new BCI2K_OperatorConnection();
  try {
    await bciOperatorConn.connect('ws://127.0.0.1');
    console.log('Connected to Operator module');
    return bciOperatorConn;
  } catch (err) {
    console.log(err);
  }
  finally{

    return bciOperatorConn
  }
};

/**
 * Will change the border color on a selectable element between red and white
 * @category BCI Utilities
 * @returns the bciDataConnection
 */

const connectToBCISource = async () => {
  let bciSourceConnection = new BCI2K.BCI2K_DataConnection();
  // bciSourceConnection.reconnect = false;
  try {
    await bciSourceConnection.connect('ws://127.0.0.1:20100');
    console.log('Connected to Source module');
    return bciSourceConnection;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Will change the border color on a selectable element between red and white
 * @category BCI Utilities
 * @param bci the current bci operator object
 */
const setupBCI = async (bci: BCI2K.BCI2K_OperatorConnection, otherCommands: string) => {
  let configReq = await fetch('/getbciconfig');
  let config = await configReq.json();
  let script = ``;
  script += `Reset System; `;
  script += `Startup System localhost; `;

  config.states.forEach((state: any) => {
    script += `Add State ${state.name} ${state.width} 0; `;
  });

  config.executables.forEach((executable: string) => {
    script += `Start executable ${executable}; `;
  });

  config.setParameters.forEach((param: string) => {
    script += `Set parameter ${param}; `;
  });
  console.log(config);

  config.loadParameterFile?.forEach((param: string) => {
    script += `Load Parameterfile ${param}; `;
  });

  script += otherCommands


  script += 'Wait for Connected; '; 
  script += 'Set Config; ';
  script += 'Start; ';
  bci.execute(script);
};

export { connectToBCIOperator, setupBCI, connectToBCISource };
