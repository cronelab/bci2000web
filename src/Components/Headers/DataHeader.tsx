import React, { useContext } from 'react'
import { Navbar } from 'react-bootstrap'
import {
    ZoomIn,
    ZoomOut,
    VolumeDown,
    VolumeUp,
    Play,
    Pencil,
    LayoutTextSidebar,
    LayoutTextSidebarReverse,
    LayoutThreeColumns,
} from 'react-bootstrap-icons'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Context } from '../../Context'

export default function DataHeader() {
    const { setRasterSize, setRasterGain } = useContext(Context)

    return (
        <Navbar style={{ backgroundColor: 'lightgray', zIndex: 999 }}>
            <Navbar.Brand>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">Zoom in</Tooltip>}
                >
                    <ZoomIn
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => setRasterSize((s) => s - 0.2)}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">Zoom out</Tooltip>}
                >
                    <ZoomOut
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => setRasterSize((s) => s + 0.2)}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="button-tooltip">Increase gain</Tooltip>
                    }
                >
                    <VolumeUp
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => setRasterGain((s) => s + 1)}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="button-tooltip">Decrease gain</Tooltip>
                    }
                >
                    <VolumeDown
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => setRasterGain((s) => s - 1)}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="button-tooltip">Play data back</Tooltip>
                    }
                >
                    <Play
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => console.log('A')}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">Annotate</Tooltip>}
                >
                    <Pencil
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => console.log('A')}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="button-tooltip">Only show data</Tooltip>
                    }
                >
                    <LayoutTextSidebar
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => console.log('A')}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="button-tooltip">Only show brain</Tooltip>
                    }
                >
                    <LayoutTextSidebarReverse
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => console.log('A')}
                    />
                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id="button-tooltip">
                            Show data and brain
                        </Tooltip>
                    }
                >
                    <LayoutThreeColumns
                        color="royalblue"
                        className="mr-4"
                        size={30}
                        onClick={() => console.log('A')}
                    />
                </OverlayTrigger>
            </Navbar.Brand>
        </Navbar>
    )
}
