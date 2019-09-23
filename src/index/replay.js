export const launchSession = (patient, task, file) => {
  var datafile = `../data/${patient}/${task}/${file}.dat`;
  let filter = 'SpectralSignalProcessingMod'
  if (task == 'CCEPS') filter = 'EvokedPotentialFilter'
  var script = "Reset System; ";
  script += "Startup System localhost; ";
  script += `Start executable ${filter} --local; `;
  script += "Start executable DummyApplication --local; ";
  script +=
    "Start executable FilePlayback --local --FileFormat=Null --PlaybackStates=1 --PlaybackFileName=" +
    datafile +
    "; ";

  script += "Wait for Connected; ";
  script += "Load Parameterfile ../parms/SpectralSigProc.prm; ";

  script += "Set Parameter WSSourceServer *:20100; ";
  script += "Set Parameter WSSpectralOutputServer *:20203; ";
  script += "Set Parameter WSConnectorServer *:20323; ";

  // script += "Set Config; ";
  // script += "Wait for Resting; ";
  // script += "Start; ";

  return script;
};