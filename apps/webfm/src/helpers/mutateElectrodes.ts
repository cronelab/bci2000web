import { select, selectAll } from "d3-selection";
import React, { useState, useContext, useRef, useEffect } from "react";
import { symbol, symbolStar } from "d3-shape";
import * as d3 from "d3";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { Group, Vector3, SphereGeometry, Color } from "three";
import { scaleLinear } from 'd3-scale'

const highlight2DElectrodes = (electrode, color, size?) => {
  let circle = document.getElementById(`${electrode}_circle`);
  console.log(circle);
  if (circle) {
    if (size) {
      circle.setAttribute("r", size);
    }
    circle.setAttribute("fill", color);
  }
};

const highlight3DElectrodes = (electrode, color?, size?) => {
  console.log(electrode);
};

const highlightCenterElectrode = (electrode1, electrode2, color, size) => {
  let circle1 = document.getElementById(`${electrode1}_circle`);
  let circle2 = document.getElementById(`${electrode2}_circle`);
  if (circle1 != null && circle2 != null) {
    let xPos1 = parseFloat(circle1.getAttribute("cx"));
    let xPos2 = parseFloat(circle2.getAttribute("cx"));
    let yPos1 = parseFloat(circle1.getAttribute("cy"));
    let yPos2 = parseFloat(circle2.getAttribute("cy"));
    let xPos = (xPos1 + xPos2) / 2;
    let yPos = (yPos1 + yPos2) / 2;
    select("#container")
      .select("svg")
      .append("circle")
      .attr("cx", xPos)
      .attr("cy", yPos)
      .attr("r", size)
      .attr("fill", color);
  }
};

const clearElectrodes = () => {
  selectAll("circle").attr("fill", "white");
  selectAll("line").remove();
};

const createLine = (electrode1, electrode2, color, container: string) => {
  if (color == "") color = "pink";
  // var pathData = symbol().type(symbolStar).size(80);

  let circle1 = document.getElementById(`${electrode1}_circle`);
  let circle2 = document.getElementById(`${electrode2}_circle`);
  let xPos1 = parseFloat(circle1.getAttribute("cx"));
  let xPos2 = parseFloat(circle2.getAttribute("cx"));
  let yPos1 = parseFloat(circle1.getAttribute("cy"));
  let yPos2 = parseFloat(circle2.getAttribute("cy"));
  //@ts-ignore
  let _container = `#${container}` | "#container";
  let line = select("#" + container)
    // .select("svg")
    .append("line")
    .attr("x1", xPos1)
    .attr("y1", yPos1)
    .attr("x2", xPos2)
    .attr("y2", yPos2)
    .attr("stroke-width", "2")
    .attr("stroke", color);
};

const highlightElectrodes = (electrode, color, size?) => {
  let circle = document.getElementById(`${electrode}_circle`);
  if (circle) {
    if (size) {
      circle.setAttribute("r", size);
    }
    circle.setAttribute("fill", color);
  }
};
const highlightBipolarElectrodes = (electrode, color, size?) => {
  let circle = document.getElementById(`${electrode.split("_")[0]}_circle`);

  let elec1 = electrode.split("_")[0];
  let elec2 = electrode.split("_")[1];
  let cx1 = parseInt(
    document.getElementById(`${elec1}_circle`).getAttribute("cx")
  );
  let cy1 = parseInt(
    document.getElementById(`${elec1}_circle`).getAttribute("cy")
  );
  let cx2 = parseInt(
    document.getElementById(`${elec2}_circle`).getAttribute("cx")
  );
  let cy2 = parseInt(
    document.getElementById(`${elec2}_circle`).getAttribute("cy")
  );
  let cx = ((cx1 + cx2) / 2).toString();
  let cy = ((cy1 + cy2) / 2).toString();
  let newElectrode = document.createElement("circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.id = `${electrode}_circle`;
  circle.setAttribute("fill", color);
  circle.setAttribute("stroke", "black");
  circle.setAttribute("r", size);
};

const removeAllAttributes = (electrodes) => {
  electrodes.forEach((electrode) =>
    document.getElementById(`${electrode}_circle`).setAttribute("fill", "white")
  );
  select("#container").select("svg").selectAll("line").remove();
};

const createShape = (electrode1, electrode2) => {
  let circle1 = document.getElementById(`${electrode1}_circle`);
  let circle2 = document.getElementById(`${electrode2}_circle`);
  let x = parseFloat(circle1.getAttribute("cx"));
  let y = parseFloat(circle2.getAttribute("cx"));
  let yPos1 = parseFloat(circle1.getAttribute("cy"));
  let yPos2 = parseFloat(circle2.getAttribute("cy"));

  var size = 20,
    // x = 0,
    // y = 0,
    value = 1.0, //Range is 0.0 - 1.0
    borderWidth = 3,
    borderColor = "black",
    starColor = "#FFB500",
    backgroundColor = "white";

  var line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  //   .interpolate("linear-closed"),
  let rad = function (deg) {
    return (deg * Math.PI) / 180;
  },
    cos = function (deg) {
      return Math.cos(rad(deg));
    },
    sin = function (deg) {
      return Math.sin(rad(deg));
    },
    tan = function (deg) {
      return Math.tan(rad(deg));
    },
    n = size,
    m = n / 2,
    h = m * tan(36),
    k = h / sin(72),
    //(x, y) points at the leftmost point of the star, not the center
    coordinates = [
      { x: x, y: y },
      { x: x + k, y: y },
      { x: x + m, y: y - h },
      { x: x + n - k, y: y },
      { x: x + n, y: y },
      { x: x + n - k * cos(36), y: y + k * sin(36) },
      { x: x + n * cos(36), y: y + n * sin(36) },
      { x: x + m, y: y + h },
      { x: x + n - n * cos(36), y: y + n * sin(36) },
      { x: x + k * cos(36), y: y + k * sin(36) },
    ];
  let selection = select("#container").select("svg");
  //inside star
  selection
    .append("path")
    .attr("d", line(coordinates))
    .style({ "stroke-width": 0, fill: starColor });

  //Rect for clipping
  //In order to avoid potential ID duplicates for clipping, clip-path is not used here
  selection
    .append("rect")
    .attr("x", x + size * value)
    .attr("y", y - h)
    .attr("width", size - size * value)
    .attr("height", size)
    .style("fill", backgroundColor);

  //border of the star
  selection
    .append("path")
    .attr("d", line(coordinates))
    .style({ "stroke-width": borderWidth, fill: "none", stroke: borderColor });
};

const create3DLine = (elec1, elec2, color, threeDElectrodes) => {
  let lineGroup = new Group();
  threeDElectrodes.updateMatrixWorld();

  lineGroup.name = "cortstimLine";
  let stimElec1 = threeDElectrodes.getObjectByName(elec1);
  let stimElec2 = threeDElectrodes.getObjectByName(elec2);
  var vector1 = new Vector3();
  var vector2 = new Vector3();
  let lineGeom = new LineGeometry();
  threeDElectrodes.parent.updateMatrixWorld();
  let elec1Pos = vector1.setFromMatrixPosition(stimElec1.matrixWorld);
  let elec2Pos = vector2.setFromMatrixPosition(stimElec2.matrixWorld);
  lineGeom.setPositions([
    elec1Pos.x,
    elec1Pos.y,
    elec1Pos.z,
    elec2Pos.x,
    elec2Pos.y,
    elec2Pos.z,
  ]);
  let material = new LineMaterial({
    //@ts-ignore
    color: color,
    linewidth: 0.005,
  });

  let line = new Line2(lineGeom, material);
  line.computeLineDistances();
  line.scale.set(1, 1, 1);
  lineGroup.add(line);
  threeDElectrodes.parent.add(lineGroup);
};
let dotColorScale = scaleLinear()
  //@ts-ignore
  .domain([-9, -5, -2, -0.01, 0.0, 0.01, 2, 5, 9])
  //@ts-ignore
  .range([
    "#313695",
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#ffffff",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
  ])
  .clamp(true);


export {
  highlight2DElectrodes,
  highlightCenterElectrode,
  clearElectrodes,
  highlight3DElectrodes,
  highlightElectrodes,
  createLine,
  create3DLine,
  removeAllAttributes,
  createShape,
  highlightBipolarElectrodes,
  dotColorScale

};
