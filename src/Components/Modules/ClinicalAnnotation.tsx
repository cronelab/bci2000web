import React, { useState, useEffect, useContext, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'

// import Container from 'react-bootstrap/Container'
import {
    fetch2DBrain,
    fetchAnnotations,
} from '../../helpers/pullAnatomicalData'
import Painterro from 'painterro'
import { Context } from '../../Context'

export default function ClinicalAnnotation() {
    const history = useHistory()

    const { activeSubject, annotator, annotateDate } = useContext(Context)
    const paintRef = useRef()
    const imageRef = useRef()
    const [img, setImg] = useState([])
    const [showImg, setShowImg] = useState(false)
    const [p, setP] = useState()
    useEffect(() => {
        ;(async () => {
            let brainImage = await fetch2DBrain(activeSubject)
            let paint = Painterro({
                id: 'paint',
                onClose: () => {
                    {
                        setShowImg(true)
                    }
                },
                saveHandler: async (image) => {
                    let formData = new FormData()
                    formData.append(
                        'image',
                        image.asBlob(),
                        `${annotator}_${annotateDate}.jpg`
                    )
                    fetch(`/api/annotation/${activeSubject}`, {
                        method: 'POST',
                        body: formData,
                    })
                        .then((recImgReq) => recImgReq.blob())
                        .then((x) => console.log(x))
                },
            })
            paint.show(brainImage)
            console.log(paint)
            setP(paint)
        })()
    }, [])

    useEffect(() => {
        ;(async () => {
            let annotationFiles = await fetchAnnotations(activeSubject)
            setImg(annotationFiles)
        })()
    }, [])

    return (
        <>
            <Navbar
                style={{
                    height: '50px',
                }}
                bg="light"
                expand="lg"
            >
                <Navbar.Brand href="/dashboard">
                    WeBrain - Clinical Annotation
                </Navbar.Brand>
                <Navbar.Brand className="ml-auto">
                    {activeSubject} by {annotator} on {annotateDate}
                </Navbar.Brand>
                <Button
                    variant="secondary"
                    onClick={() => history.push('/dashboard')}
                >
                    X
                </Button>
            </Navbar>
            <div ref={paintRef} style={{ position: 'relative' }}>
                <div id="paint" style={{ height: '700px' }}></div>
            </div>
            {showImg ? (
                <Container fluid>
                    <Row>
                        {img.map((x) => {
                            return (
                                <Col>
                                    <Image ref={imageRef} src={x} fluid></Image>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            ) : (
                <></>
            )}
        </>
    )
}
