import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import './elevationprofile.css';
import { Chip } from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";

const ElevationProfile = () => {
    const [data, setData] = useState([]);
    const [startDistance, setStartDistance] = useState(0);
    const [endDistance, setEndDistance] = useState(0);
    const [netDistance, setNetDistance] = useState(0);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            axios.post('http://127.0.0.1:5000/get-elevation-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                setData(response.data.data);
            })
            .catch(error => {
                console.error('Error uploading file', error);
            });
        }
    };
    const handleBrushChange = (e) => {
        if (e && e.startIndex !== e.endIndex) {
            const startDistance = data[e.startIndex].distance;
            const endDistance = data[e.endIndex].distance;
            setStartDistance(startDistance);
            setEndDistance(endDistance);
            setNetDistance (endDistance - startDistance);
        }
    };

    const formatXAxis = (tickItem) => {
        // Divide by 1000 and fix to 0 decimal points
        return (tickItem / 1000).toFixed(0);
    };

    return (
        <div className='elevationprofile'>
            {data.length > 0 ? (
                <>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="distance" tickFormatter={formatXAxis} />
                        <YAxis label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line 
                            type="monotone" 
                            dataKey="elevation" 
                            stroke="#8884d8" 
                            strokeWidth={1}
                            dot={false} 
                        />
                        <Brush dataKey="distance" height={20} stroke="#8884d8" onChange={handleBrushChange} tickFormatter={formatXAxis} />
                    </LineChart>
                </ResponsiveContainer>

            <div className='distance-info'>
                <Chip>Start: {(startDistance / 1000).toFixed(0)} km</Chip>
                <Chip>End: {(endDistance / 1000).toFixed(0)} km</Chip>
                <Chip>Distance: {(netDistance / 1000).toFixed(0)} km</Chip>
            </div>
             </>
                ) : (
                    <div>
                        <div className='simulate-info'>Please upload a GPX file for the race you would like to find trails for.</div>
                        <div><input type="file" onChange={handleFileChange} /></div>
                        <Button className='gpx-upload-button' color="success" onClick={handleUpload}>
                            Let's go!
                        </Button>
                    </div>
                )}
        </div>
        );
    };
    
    export default ElevationProfile;