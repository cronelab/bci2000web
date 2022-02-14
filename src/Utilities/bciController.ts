// bciController.ts
/**
 *
 * @module
 */
import * as BCI2K from 'bci2k';

/**
 * Will change the border color on a selectable element between red and white
 * @category BCI Utilities
 * @returns the bciOperatorConnection
 */
const connectToBCIOperator = async () => {
  let bciOperatorConn = new BCI2K.bciOperator();
  try {
    await bciOperatorConn.connect('ws://127.0.0.1');
    console.log('Connected to Operator module');
    return bciOperatorConn;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Will change the border color on a selectable element between red and white
 * @category BCI Utilities
 * @returns the bciDataConnection
 */

const connectToBCISource = async () => {
  let bciSourceConnection = new BCI2K.bciData();
  bciSourceConnection.reconnect = false;
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
const setupBCI = async (bci, otherCommands) => {
  let configReq = await fetch('/getbciconfig');
  let config = await configReq.json();
  let script = ``;
  script += `Reset System; `;
  script += `Startup System localhost; `;

  config.states.forEach((state) => {
    script += `Add State ${state.name} ${state.width} 0; `;
  });

  config.executables.forEach((executable) => {
    script += `Start executable ${executable}; `;
  });

  config.setParameters.forEach((param) => {
    script += `Set parameter ${param}; `;
  });
  console.log(config);

  config.loadParameterFile?.forEach((param) => {
    script += `Load Parameterfile ${param}; `;
  });

  script += otherCommands


  script += 'Wait for Connected; '; 
  script += 'Set Config; ';
  script += 'Start; ';
  bci.execute(script);
};

export { connectToBCIOperator, setupBCI, connectToBCISource };
