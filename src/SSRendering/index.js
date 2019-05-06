import BCI2K from "bci2k";
var bci = new BCI2K.bciOperator();
import * as d3 from "d3";

window.onload = () => {
    bci.connect("127.0.0.1").then(() => {
        console.log("connected");
        tapSockets(bci);
    });
};


const tapSockets = async bciInstance => {
    let source = await bciInstance.tap("Source");
    let dataBuffer1 = []
    let dataBuffer2 = []
    source.onGenericSignal = data => {
        dataBuffer1.push(...data[0])
        if (dataBuffer1.length > 200) {
            generateChart(dataBuffer1);
            // dataBuffer.splice(0,32)
            dataBuffer1 = []
        }
    };
};

const generateChart = data => {

    d3.select("#fm-chart-container")
        .selectAll("svg > *")
        .remove();

    let dataset = data.map(x => {
        return {
            y: x
        };
    });
    let margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };
    let width = 1000 - margin.left - margin.right;
    let height = 250 - margin.top - margin.bottom;




    let xScale = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);

    let yScale = d3
        .scaleLinear()
        .domain([-100, 100])
        .range([height, 0]);

    let line = 
        d3.line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d.y))
        .curve(d3.curveMonotoneX);

    let svg1 = d3.select("#fm-chart1");
    
    svg1
        .attr("width", width - margin.left - margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg1
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg1
        .append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    svg1
        .append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "black");


};