import React, { useRef, useState, useEffect, useContext } from 'react'

import { scaleBand, scaleLinear } from 'd3-scale'
import { range } from 'd3-array'
import * as fc from 'd3fc'

const Colorbar = (props) => {
    // Band scale for x-axis
    let container = document.getElementById('colorbarDiv')
    let min,
        max,
        height,
        domain = 10
    const expandedDomain = range(min, max, (max - min) / height)

    const xScale = scaleBand().domain([0, 1]).range([0, 100])

    // Linear scale for y-axis
    const yScale = scaleLinear().domain(domain).range([height, 0])

    // Defining the legend bar
    const svgBar = fc
        .autoBandwidth(fc.seriesSvgBar())
        .xScale(xScale)
        .yScale(yScale)
        .crossValue(0)
        .baseValue((_, i) => (i > 0 ? expandedDomain[i - 1] : 0))
        .mainValue((d) => d)
    // .decorate(selection => {
    //   selection.selectAll("path").style("fill", d => colourScale(d));
    // }
    // );

    // Drawing the legend bar
    const legendSvg = container.append('svg')
    //@ts-ignore
    const legendBar = legendSvg.append('g').datum(expandedDomain).call(svgBar)
}

export default Colorbar
