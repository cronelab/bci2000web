import React, { useContext, useEffect, useState, useRef } from 'react'
// import { dotColorScale } from "../../helpers/mutateElectrodes";
import { Mesh, Color } from 'three'

import { Model } from '../BrainContainers/Brain_3D'
import { Context } from '../../Context'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
export default function EpilepticAreas() {
    const {
        brainType,
        activeRecord,
        setActiveRecord,
        threeDElectrodes,
    } = useContext(Context)
    const [labels, setLabels] = useState({})
    useEffect(() => {
        // setLabels()
        Object.keys(activeRecord).forEach((chan) => {
            if (activeRecord[chan].label == 1) {
                activeRecord[chan].label = 'SOZ'
                activeRecord[chan].color = 'rgb(255, 0, 0)' //red
            } else if (activeRecord[chan].label == 2) {
                activeRecord[chan].label = 'EP'
                activeRecord[chan].color = 'rgb(255, 165, 0)' //orange
            } else if (activeRecord[chan].label == 3) {
                activeRecord[chan].label = 'IZ'
                activeRecord[chan].color = 'rgb(255, 255, 0)' //yellow
            } else if (activeRecord[chan].label == 0) {
                activeRecord[chan].label = 'non-EP'
                activeRecord[chan].color = 'rgb(220,220,220)' //gray
            }
        })
    }, [])
    useEffect(() => {
        if (threeDElectrodes != undefined) {
            console.log(activeRecord)
            threeDElectrodes.traverse((child) => {
                console.log(child.name)
                if (child instanceof Mesh) {
                    if (activeRecord[child.name] != undefined) {
                        child.scale.set(
                            activeRecord[child.name].size + 2,
                            activeRecord[child.name].size + 2,
                            activeRecord[child.name].size + 2
                        )
                        //@ts-ignore
                        let clone = child.material.clone()
                        child.material = clone
                        clone.color = new Color(activeRecord[child.name].color)
                        //@ts-ignore
                        child.material.name = `${child.name}_color`
                    }
                    //   else{
                    //       child.scale.set(.2,.2,.2)
                    //   }
                }
            })
        }
    }, [threeDElectrodes])
    return (
        <Container fluid>
            <Row>
                <Col
                    style={{
                        height: `${window.innerHeight * 0.8}px`,
                        overflow: 'auto',
                    }}
                >
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Electrode</th>
                                <th>Label</th>
                            </tr>
                        </thead>
                        {Object.keys(activeRecord).map((chan) => {
                            return (
                                <>
                                    <tbody>
                                        <tr>
                                            <td>{chan}</td>
                                            <td>{activeRecord[chan].label}</td>
                                        </tr>
                                    </tbody>
                                </>
                            )
                        })}
                    </Table>
                </Col>
                <Col>
                    <Model></Model>
                </Col>
            </Row>
        </Container>
    )
}
