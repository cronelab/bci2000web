import React from 'react'
import { Image } from 'react-bootstrap'
import BrainGif from '../assets/Brain.gif'
import { useHistory } from 'react-router-dom'

export default function Welcome() {
    const history = useHistory()
    return (
        <div onClick={() => history.push('/dashboard')}>
            <h1 style={{ textAlign: 'center' }}>Welcome to WEBrain</h1>
            <Image fluid src={BrainGif}></Image>
        </div>
    )
}
