import './toolbar.css';

import React from 'react';
import axios from 'axios';
import { Button } from "@nextui-org/react";

function Toolbar({ trailCoords }) {

    const downloadGPX = () => {
        const params = {
            coordinates: trailCoords
        };

        axios.post("https://trailfinder.fly.dev/get-gpx", params, {
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'trail.gpx');
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('There was an error fetching the GPX', error);
        });
    }

    return (
        <div className='toolbar d-flex justify-content-end'>
            <Button 
                color={trailCoords.length ? "primary" : "secondary"}
                onClick={downloadGPX}
                disabled={!trailCoords.length}
            >
                Download GPX
            </Button> 
        </div>
    );
}

export default Toolbar;
