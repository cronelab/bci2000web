import React, { useRef, useContext } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DataHeader from '../Headers/DataHeader'
import { Context } from '../../Context'

import Brain_2D from '../BrainContainers/Brain_2D'
import { Model } from '../BrainContainers/Brain_3D'
import Chart from 'd3-heatmap'
export default function HeatMap() {
    const fmRef = useRef()
    const { brainType } = useContext(Context)
    return (
        <>
            <DataHeader></DataHeader>
            <Container fluid>
                <Row>
                    <Col>
                        <div
                            id="fm"
                            ref={fmRef}
                            style={{
                                height: `${window.innerHeight * 0.8}px`,
                                overflow: 'auto',
                            }}
                        ></div>
                    </Col>
                    <Col>
                        {brainType == '2D' ? (
                            <Brain_2D></Brain_2D>
                        ) : (
                            <Model></Model>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
