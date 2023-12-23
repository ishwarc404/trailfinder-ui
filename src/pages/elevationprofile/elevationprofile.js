import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import './elevationprofile.css';
import { Chip, Button } from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";

const ElevationProfile = () => {
    const [data, setData] = useState([]);
    const [startDistance, setStartDistance] = useState(0);
    const [endDistance, setEndDistance] = useState(0);
    const [netDistance, setNetDistance] = useState(0);
    const [elevationGain, setElevationGain] = useState(0);
    const [elevationLoss, setElevationLoss] = useState(0);
    const [file, setFile] = useState(null);
    const [raceValue, setRaceValue] = useState("");


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
                setEndDistance(response.data.data[response.data.data.length-1]['distance'])
            })
            .catch(error => {
                console.error('Error uploading file', error);
            });
        }

        if(raceValue) {
            axios.post('http://127.0.0.1:5000/get-elevation-profile', {
                'race': raceValue
            })
            .then(response => {
                setData(response.data.data);
                setEndDistance(response.data.data[response.data.data.length-1]['distance'])
            })
            .catch(error => {
                console.error('Error getting data', error);
            });
        }
    };

    const handleBrushChange = (e) => {
        if (e && e.startIndex !== e.endIndex) {
            const startIndex = e.startIndex;
            const endIndex = e.endIndex;

            let totalGain = 0;
            let totalLoss = 0;
            let prevElevation = data[startIndex].elevation;

            for (let i = startIndex + 1; i <= endIndex; i++) {
                const elevation = data[i].elevation;
                if (elevation > prevElevation) {
                    totalGain += (elevation - prevElevation);
                } else {
                    totalLoss += (prevElevation - elevation);
                }
                prevElevation = elevation;
            }

            setStartDistance(data[startIndex].distance);
            setEndDistance(data[endIndex].distance);
            setNetDistance(data[endIndex].distance - data[startIndex].distance);
            setElevationGain(totalGain);
            setElevationLoss(totalLoss);
        }
    };

    const formatXAxis = (tickItem) => {
        // Divide by 1000 and fix to 0 decimal points
        return (tickItem / 1000).toFixed(0);
    };

     const races = [
        {label: "Hardrock 100", value: "hr100", description: ""},
        {label: "WSER", value: "wser", description: ""},
     ]

     const handleRaceSelectionChange = (e) => {
        setRaceValue(e.target.value);
        console.log(e)
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
                <Chip className='info-chips'>{(startDistance / 1000).toFixed(0)} km -  {(endDistance / 1000).toFixed(0)} km</Chip>
                <Chip className='info-chips'>Distance: {(netDistance / 1000).toFixed(0)} km</Chip>
                <Chip className='info-chips'> Elev Gain: {elevationGain.toFixed(1)} m</Chip>
                <Chip className='info-chips'> Elev Loss: {elevationLoss.toFixed(1)} m</Chip>
            </div>
             </>
                ) : (
                    <div>
                        <div className='simulate-info'>Please upload a GPX file for the race you would like to find trails for.</div>
                        <div className='file-uploader'><input type="file" onChange={handleFileChange} /></div>
                        <div className='simulate-info-or'>Or, you can also choose from one of these popular races.</div>
                        <div className='race-selector'>
                        <Select 
                            label="Select a race" 
                            className="max-w-xs" 
                            color='success'
                            onChange={handleRaceSelectionChange}
                        >
                            {races.map((race) => (
                            <SelectItem key={race.value} value={race.value}>
                                {race.label}
                            </SelectItem>
                            ))}
                        </Select>
                        </div>
                        <div className='race-selector'>
                        <Button className='gpx-upload-button' color="success" onClick={handleUpload}>
                            Let's go!
                        </Button>
                        </div>
                    </div>
                )}
        </div>
        );
    };
    
    export default ElevationProfile;