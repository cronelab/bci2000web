const BCI2K = require("bci2k");
const D3Node = require("d3-node");
const d3 = require("d3");
let bci = new BCI2K();

function generateChart(data) {
  var d3n = new D3Node();
  let dataset = data.map(x => {
    return { y: x };
  });

  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 980 - margin.left - margin.right, // Use the window's width
    height = 420 - margin.top - margin.bottom; // Use the window's height

  var svg = d3n
    .createSVG()
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1]) // input
    .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3
    .scaleLinear()
    .domain([-100, 100]) // input
    .range([height, 0]); // output

  // 7. d3's line generator
  var line = d3
    .line()
    .x(function(d, i) {
      return xScale(i);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

  // 1. Add the SVG to the page and employ #2

  // 3. Call the x axis in a group tag
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg
    .append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "black");

  return d3n;
}

const connectToSource = async () => {
  var script = "Reset System; ";
  script += "Startup System localhost; ";
  script += "Start executable SpectralSignalProcessingMod --local; ";
  script += "Start executable DummyApplication --local; ";
  script += "Start executable SignalGenerator --local; ";
  
  script += "Wait for Connected; ";
  script += "Load Parameterfile ../parms.ecog/SpectralSigProc.prm; ";
  script += "Set Parameter SineFrequency 5Hz; ";
  script += "Set Parameter SamplingRate 512Hz; ";

  script += "Set Parameter WSSpectralOutputServer *:20203; ";
  script += "Set Parameter WSConnectorServer *:20323; ";
  script += "Set Parameter WSSourceServer *:20100; ";
  bci.execute(script);
  bci.execute("Set Config");
  bci.execute("Start");
  await new Promise(resolve => setTimeout(resolve, 3000));
  return (sourceConnection = await bci.tap("Source"));
};

const wsSend = app => {
  app.ws("/1", function(ws, req) {
    bci.connect("127.0.0.1");
    bci.onconnect = e => {
      connectToSource().then(sourceCon => {
        try {
          console.log("Connected");
          sourceCon.onGenericSignal = data => {
            ws.send(generateChart(data[0]).svgString());
            // ws.send(JSON.stringify(data));
          };
        } catch (err) {
          console.error(err);
        }
      });
    };
  });
};

module.exports = wsSend;
