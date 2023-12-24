import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import './elevationprofile.css';
import { Chip, Button } from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import {Listbox, ListboxItem} from "@nextui-org/react";

const ElevationProfile = ({ onTrailSelect }) => {
    const [data, setData] = useState([]); //gpx elevation data
    const [startDistance, setStartDistance] = useState(0);
    const [endDistance, setEndDistance] = useState(0);
    const [netDistance, setNetDistance] = useState(0);
    const [elevationGain, setElevationGain] = useState(0);
    const [elevationLoss, setElevationLoss] = useState(0);
    const [file, setFile] = useState(null);
    const [raceValue, setRaceValue] = useState("");

    //for not analysis search
    const [trails, setTrails] = useState([]); // State to store the trails


    const [GPXAnalysis, setGPXAnalysis] = useState([]);
    const [GPXSegmentTrails, setGPXSegmentTrails] = useState([]); // State to store the trails


    function fetchTrails() {
        // Define the JSON object to send
        const params = {
          distance_minimum : (netDistance/1000) - 200,
          distance_maximum : (netDistance/1000) + 200,
          elevation_gain_minimum : (elevationGain) - 200,
          elevation_gain_maximum : (elevationGain) + 200,
          elevation_loss_minimum : (elevationLoss) - 200,
          elevation_loss_maximum : (elevationLoss) + 200
        };
    
        // Use a POST request if you want to send a JSON object in the request body
        axios.post("http://127.0.0.1:5000/get-trails", params)
          .then(response => {
            // Handle the response data (list of trails)
            setTrails(response.data);
        })
          .catch(error => {
            // Handle any errors here
            console.error('There was an error fetching the trails', error);
          });
      }


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

    function getAnalysisData () {

        if(raceValue) {
            axios.post("http://127.0.0.1:5000/analyse-gpx", {
                'type': 'race',
                'race': raceValue
            })
            .then(response => {
            setGPXAnalysis(response.data);
            setTrails([]);
            })
            .catch(error => {
            // Handle any errors here
            console.error('There was an error fetching the analysis', error);
            });
        }

        if(file) {
            console.log(file)
            axios.post("http://127.0.0.1:5000/analyse-gpx", {
                'type': 'file',
                'filename': file.name
            })
            .then(response => {
            setGPXAnalysis(response.data);
            })
            .catch(error => {
            // Handle any errors here
            console.error('There was an error fetching the analysis', error);
            });
        }

    }

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


    function handleTrailSelect(key) {
        for(let i = 0; i < GPXAnalysis.length ; i ++){
          if(GPXAnalysis[i]["id"] == key){
          setGPXSegmentTrails(GPXAnalysis[i]["trails"]); // Use the coordinates property
        }
        }
      }

    //FOR ANALYSIS
      function handleTrailSelectForDisplay(key) {
        for(let i = 0; i < GPXSegmentTrails.length ; i ++){
          if(GPXSegmentTrails[i]["id"] == key){
          onTrailSelect(GPXSegmentTrails[i]["coordinates"]); // Use the coordinates property
        }
        }
      }
      
        //FOR SEARCH
        function handleTrailSelectForDisplaySearch(key) {
            for(let i = 0; i < trails.length ; i ++){
              if(trails[i]["id"] == key){
                onTrailSelect(trails[i]["coordinates"]); // Use the coordinates property
            }
            }
          }
    
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
                    <div className='gpx-bt-parent'>
                    <Button className='gpx-bt' color='primary' onClick={fetchTrails}>
                        Search for trails
                    </Button>
                    <Button className="gpx-bt bg-gradient-to-tr from-orange-500 to-red-500 text-white" onClick={getAnalysisData}>
                        Analyse & Recommend
                    </Button>
                    </div>

                    { trails.length > 0 ? 
                    <div className="listbox-wrapper-gpx-search">
                        <Listbox
                        items={trails}
                        aria-label="Trails"
                        onAction={handleTrailSelectForDisplaySearch}
                        >
                        {(item) => (
                            <ListboxItem
                            key={item.id}
                            color={"default"}
                            className={""}
                            >
                            Trail: {(item.id) } &nbsp;

                            <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Distance: {(item.distance / 1000).toFixed(1) } km</Chip>
                                {item.elevation_gain ? <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Gain: {Math.round(item.elevation_gain)} m</Chip>  : ""}
                                {item.elevation_loss ? <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Loss: {Math.round(item.elevation_loss)} m</Chip>  : ""}
                            </ListboxItem>
                        )}
                        </Listbox>
                    </div>
                    :
                    <div className='d-flex justify-content-start'>
                    <div className="listbox-wrapper-gpx-analysis">
                    <Listbox
                        items={GPXAnalysis}
                        aria-label="Segments"
                        onAction={handleTrailSelect}
                        >
                        {(item) => (
                            <ListboxItem
                            key={item.id}
                            color={"default"}
                            className={""}
                            >
                            <Chip className='info-chips-gpx-analysis ' color='secondary'>{(item.type).toUpperCase() }</Chip>
                            <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">{(item['start_distance'] / 1000).toFixed(1) } - {(item['end_distance'] / 1000).toFixed(1) } km</Chip>
                            <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Distance: {(item['distance'] / 1000).toFixed(1) } km
                            |
                            D+: {(item['elevation_change']).toFixed(1) } m</Chip>

                            </ListboxItem>
                        )}
                    </Listbox>
                    </div>

                    <div className="listbox-wrapper-gpx-analysis-trails">
                        <Listbox
                        items={GPXSegmentTrails}
                        aria-label="Trails"
                        onAction={handleTrailSelectForDisplay}
                        >
                        {(item) => (
                            <ListboxItem
                            key={item.id}
                            color={"default"}
                            className={""}
                            >
                            <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Distance: {(item.distance / 1000).toFixed(1) } km</Chip>
                            {item.elevation_gain ? <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Gain: {Math.round(item.elevation_gain)} m</Chip>  : ""}
                            {item.elevation_loss ? <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Loss: {Math.round(item.elevation_loss)} m</Chip>  : ""}
                            </ListboxItem>
                        )}
                        </Listbox>
                    </div>
                    </div>
}


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