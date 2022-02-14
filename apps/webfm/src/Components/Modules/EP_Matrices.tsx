//@ts-nocheck
import React, { useState, useEffect, useContext } from 'react'
import { Dropdown, Container, Row, Col, Image } from 'react-bootstrap'
import { Context } from '../../Context'
export default function EP_Matrices() {
    const [records, setRecords] = useState(null)
    const [image, setImage] = useState<String>()
    const { aciveSubject } = useContext(Context)
    useEffect(() => {
        ;(async () => {
            let req = await fetch(
                `/api/data/${activeSubject}/ccepPics/list/all`
            )
            let res = await req.json()
            setRecords(res)
        })()
    }, [])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="success"
                                id="dropdown-basic"
                            >
                                Matrices
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {records ? (
                                    records.matrices.map((matrix, i) => {
                                        return (
                                            <Dropdown.Item
                                                onClick={async () => {
                                                    let type
                                                    if (i == 0) {
                                                        type = 'anatomical'
                                                    } else if (i == 1) {
                                                        type = 'electrode'
                                                    }
                                                    let res = await fetch(
                                                        `/api/data/PY20N012/ccepPics/matrix/${type}`
                                                    )
                                                    let matrIm = await res.arrayBuffer()
                                                    let binary = ''
                                                    let bytes = [].slice.call(
                                                        new Uint8Array(matrIm)
                                                    )
                                                    bytes.forEach(
                                                        (b: any) =>
                                                            (binary += String.fromCharCode(
                                                                b
                                                            ))
                                                    )
                                                    setImage(binary)
                                                }}
                                            >
                                                {matrix}
                                            </Dropdown.Item>
                                        )
                                    })
                                ) : (
                                    <div></div>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
