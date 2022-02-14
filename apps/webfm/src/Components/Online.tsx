//@ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import {
    Card,
    InputGroup,
    Button,
    FormControl,
} from '../../node_modules/react-bootstrap'
import { Link } from 'react-router-dom'
import { Context } from '../Context'
import BCI2K from 'bci2k'
import Subjects from './Subjects'
import Raster from './Raster'
import Map2 from './Map/Map2'
const Online = () => {
    let {
        bciState,
        setBciState,
        setNewRecord,
        setNewSubject,
        modality,
        setModality,
    } = useContext(Context)
    const [showOnline, setShowOnline] = useState(false)
    const [bciAddress, setBciAddress] = useState('ws://127.0.0.1')
    const [channels, setChannels] = useState()
    const [timingStrategy, setTimingStrategy] = useState('State')
    // const [block, setBlock] = useState(0)

    const [sourceProperties, setSourceProperties] = useState({})
    const [filterProperties, setFilterProperties] = useState({})

    const [canProcess, setCanProcess] = useState(false)

    // let block = 0;
    // let bciOperator = new BCI2K.bciOperator();
    // let bciSourceConnection = new BCI2K.bciData();
    // let bciFilterConnection = new BCI2K.bciData();

    // useEffect(() => {
    //   (async () => {
    //     try {
    //       await bciOperator.connect(bciAddress)
    //       bciOperator.stateListen();
    //       bciOperator.onStateChange = async e => {
    //         if (e != "Idle")// || e != "Not Connected")
    //         {
    //           console.log(e)
    //           let subjectName = await bciOperator.getSubjectName();
    //           let dataFile = await bciOperator.getTaskName()
    //           setNewRecord({ name: dataFile.split("/")[1] });
    //           setNewSubject({ name: subjectName })
    //         }
    //         setBciState(e)
    //       };
    //       let params = await bciOperator.getParameters();
    //       // console.log(params)
    //       await Promise.all([bciSourceConnection.connect("ws://127.0.0.1:20100"), bciFilterConnection.connect("ws://127.0.0.1:20203")]);

    //       bciSourceConnection.onSignalProperties = (props: any) => {
    //         // setChannels(properties.channels)
    //         // console.log(properties)
    //         setSourceProperties(props)
    //       }

    //       bciFilterConnection.onSignalProperties = (props: any) => {
    //         setFilterProperties(props)

    //       }

    //     } catch (err) {
    //       console.log(err)
    //     }

    //   })()
    // }, []);

    // useEffect(() => {
    //   console.log(canProcess)
    //   // if (canProcess) {
    //   bciSourceConnection.onReceiveBlock = () => {
    //     block++;
    //     console.log(block)
    //   }
    //   // console.log(block)
    //   // console.log(bciSourceConnection.states)
    //   // console.log(bciSourceConnection.signal)
    //   // };
    // }, [canProcess])

    // const _processFeatureSignal = (signal: any) => {
    //   this.featureBlockNumber += 1;

    //   let computedFeatures = !this._featureKernel
    //     ? signal.map((dv: any) => 0.0)
    //     : signal.map((dv: any) => {
    //       return dv.reduce((acc: any, el: any, iel: any) => {
    //         return acc + el * this._featureKernel[iel];
    //       }, 0.0);
    //     });

    //   this.featureBuffer.forEach((fv: any) => fv.shift());
    //   computedFeatures.forEach((d: any, i: any) => this.featureBuffer[i].push(d));
    //   if (this.trialEndBlockNumber)
    //     if (this.featureBlockNumber >= this.trialEndBlockNumber)
    //       this._sendTrial();
    //   this.onFeatureSignal(this._formatData("Feature", computedFeatures));
    // }

    // useEffect(() => {
    //   console.log(sourceProperties)
    //   console.log(filterProperties)
    //   if (Object.keys(filterProperties).length > 1) {
    //     // @ts-ignore
    //     let featureFreqs = filterProperties.elements.map((e: any) => {
    //       //@ts-ignore
    //       return filterProperties.elementunit.offset +
    //         //@ts-ignore
    //         parseInt(e) * filterProperties.elementunit.gain;
    //     });
    //     let featureKernel = featureFreqs.map(
    //       (f: any) => 1.0 / featureFreqs.length
    //     );

    //     let trialWindow =
    //     {
    //       start: -1.0,
    //       end: 2.0,
    //     };
    //     let _bufferPadding = 0.5;
    //     let _bufferWindow =
    //     {
    //       start: trialWindow.start - _bufferPadding,
    //       end: trialWindow.end + _bufferPadding,
    //     };

    //     //@ts-ignore
    //     let blockLengthSeconds = sourceProperties.numelements * sourceProperties.elementunit.gain;
    //     let windowLengthSeconds = _bufferWindow.end - _bufferWindow.start;
    //     let windowLengthBlocks = Math.ceil(windowLengthSeconds / blockLengthSeconds);

    //     console.log(blockLengthSeconds)
    //     console.log(windowLengthSeconds)
    //     console.log(windowLengthBlocks)

    //     //@ts-ignore
    //     let featureBuffer = filterProperties.channels.reduce((
    //       arr: any,
    //       ch: any,
    //       i: any
    //     ) => {
    //       arr.push(
    //         Array.apply(null, new Array(windowLengthBlocks)).map(
    //           Number.prototype.valueOf,
    //           0
    //         )
    //       );
    //       return arr;
    //     },
    //       []);
    //     let _trialBlocks = Math.ceil(
    //       (trialWindow.end - trialWindow.start) / blockLengthSeconds
    //     );
    //     let _postTrialBlocks = Math.ceil(
    //       trialWindow.end / blockLengthSeconds
    //     );
    //     console.log(_trialBlocks)
    //     console.log(_postTrialBlocks)
    //     console.log(
    //       "Created feature buffer: " +
    //       //@ts-ignore
    //       filterProperties.channels.length +
    //       " channels x " +
    //       windowLengthBlocks +
    //       " samples."
    //     );
    //     setCanProcess(true);
    //   }

    // }, [sourceProperties && filterProperties])

    const OnlineViewer = () => {
        if (modality == 'Online') {
            return (
                <Card className="text-center">
                    <Card.Header>
                        <Card.Title
                            as="h3"
                            onClick={() => setShowOnline(!showOnline)}
                        >
                            Online
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <InputGroup
                            className={showOnline ? '' : 'd-none'}
                            id="online-options"
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    Source
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id="source-address"
                                type="text"
                                defaultValue={bciAddress}
                            />
                            <InputGroup.Append>
                                <Button
                                    id="source-address-ok"
                                    variant="outline-secondary"
                                    onClick={() =>
                                        //@ts-ignore
                                        setBciAddress(
                                            document.getElementById(
                                                'source-address'
                                            ).value
                                        )
                                    }
                                >
                                    Set address
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>

                        <Card.Text>{bciState}</Card.Text>
                    </Card.Body>
                    {/* <Link to="/map"> */}
                    <Button
                        id="map-button"
                        className={
                            bciState == 'Not Connected'
                                ? 'text-center disabled'
                                : 'text-center'
                        }
                        onClick={() => setModality('Mapping')}
                    >
                        Map
                    </Button>
                    {/* </Link> */}
                </Card>
            )
        } else if (modality == 'Review') {
            return <Subjects></Subjects>
        } else if (modality == 'Mapping') {
            return (
                <Map2></Map2>
                // <Raster numChannels={channels}></Raster>
            )
        }
    }

    return (
        <>
            <OnlineViewer></OnlineViewer>
        </>
    )
}
export default Online
