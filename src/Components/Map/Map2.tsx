//@ts-nocheck
import React, { useEffect, useContext, useRef, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
// import Brain from "../../src_v1/Components/Brain";
import '../Record/Record.scss'
import fmdata from '../../shared/fmdata'
import fmui from '../../shared/fmui'
import OnlineDataSource from '../../shared/fmonline'
import BCI2K from 'bci2k'
import { DataHeader } from '../DataHeader'
// import MapModals from "./MapModals";
// import HighGamma from "../HighGamma";
import Worker from '../../shared/dataIndex.worker'

// const dataIndexer = new Worker();
import { Context } from '../../Context'
import { select, selectAll, mouse } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'
import * as horizon from 'd3-horizon-chart'

export const Map2 = () => {
    useEffect(() => {
        // (async () => {
        let dataSource = new OnlineDataSource()
        let dataset = new fmdata()
        console.log(dataset)

        dataSource.connect('ws://127.0.0.1')
        dataSource.onproperties = (properties: any) => {
            dataset.setupChannels(properties.channels)
            // uiManager.updateChannelNames(properties.channels);
        }
        dataSource.onBufferCreated = () => {
            dataset.updateTimesFromWindow(
                dataSource.trialWindow,
                dataSource._trialBlocks
            )
        }
        dataSource.ontrial = async (trialData) => {
            console.log(trialData)
            await dataset.ingest(trialData)
            console.log(dataset.displayData)
        }
        // })()
    })
    return <div></div>
}

export default Map2
