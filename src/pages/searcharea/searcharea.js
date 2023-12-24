import './searcharea.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import { Slider } from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import {Tabs, Tab} from "@nextui-org/react";
import {Listbox, ListboxItem} from "@nextui-org/react";
import {ListboxWrapper} from "./ListboxWrapper";
import ElevationProfile from '../elevationprofile/elevationprofile';
import { Chip } from "@nextui-org/react";


function Searcharea({ onTrailSelect }) {

  const [loadingState, setLoading] = useState(false);


  const [distanceValue, setDistanceValue] = useState([2, 13]);
  const [elevationGainValue, setGainValue] = useState([50, 150]);
  const [elevationLossValue, setLossValue] = useState([50, 150]);
  const [trails, setTrails] = useState([]); // State to store the trails
  const [selectedTrail, setSelectedTrail] = useState([]);

  function fetchTrails() {
    setLoading(true);
    // Define the JSON object to send
    const params = {
      distance_minimum : distanceValue[0],
      distance_maximum : distanceValue[1],
      elevation_gain_minimum : elevationGainValue[0],
      elevation_gain_maximum : elevationGainValue[1],
      elevation_loss_minimum : elevationLossValue[0],
      elevation_loss_maximum : elevationLossValue[1]
    };

    // Use a POST request if you want to send a JSON object in the request body
    axios.post("http://127.0.0.1:5000/get-trails", params)
      .then(response => {
        // Handle the response data (list of trails)
        setTrails(response.data);
        setLoading(false);
      })
      .catch(error => {
        // Handle any errors here
        console.error('There was an error fetching the trails', error);
        setLoading(false);

      });
  }

  function handleTrailSelect(key) {
    for(let i = 0; i < trails.length ; i ++){
      if(trails[i]["id"] == key){
      onTrailSelect(trails[i]["coordinates"]); // Use the coordinates property
    }
    }
  }
  


  return (
    <div className='searcharea'>
      {/* <ElevationProfile /> */}
      <div className='search-parent'>
        <div className='search-heading'>
          SEARCH
        </div>

        <div className='distance-slider-parent'>
          <Slider
            label="Distance (kms)"
            formatOptions={{}}
            step={1}
            maxValue={15}
            minValue={0}
            value={distanceValue}
            onChange={setDistanceValue}
            color="success"
            showSteps={true}
          />
        </div>

        <div className='distance-slider-parent'>
          <Slider
            label="Elevation Gain (meters)"
            formatOptions={{}}
            step={50}
            maxValue={1000}
            minValue={50}
            value={elevationGainValue}
            onChange={setGainValue}
            color="foreground"
            showSteps={true}
          />
        </div>

        <div className='distance-slider-parent'>
          <Slider
            label="Elevation Loss (meters)"
            formatOptions={{}}
            step={50}
            maxValue={1000}
            minValue={50}
            value={elevationLossValue}
            onChange={setLossValue}
            color="foreground"
            showSteps={true}
          />
        </div>

        <div  className='search-button'>
          <Button 
          color="default" 
          varient="flat"
          onClick={fetchTrails}
          isLoading = {loadingState}
          >
          Search
           </Button> 
        </div>
      </div>

      <div className="listbox-wrapper">
        <Listbox
          items={trails}
          aria-label="Trails"
          onAction={handleTrailSelect}
        >
          {(item) => (
            <ListboxItem
              key={item.id}
              color={"default"}
              className={""}
            >
              Trail: {(item.id) } &nbsp;
              {/* Distance: {(item.distance / 1000).toFixed(1) } km
              Gain: {Math.round(item.elevation_gain) } &nbsp;
              Loss: {Math.round(item.elevation_loss) } */}

              <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Distance: {(item.distance / 1000).toFixed(1) } km</Chip>
                {item.elevation_gain ? <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Gain: {Math.round(item.elevation_gain)} m</Chip>  : ""}
                {item.elevation_loss ? <Chip className='info-chips-gpx-analysis ' color='secondary' variant="bordered">Loss: {Math.round(item.elevation_loss)} m</Chip>  : ""}
            </ListboxItem>
          )}
        </Listbox>
      </div>

      <div className="trails-found-heading">{ trails.length } trails found. Select a trail to view it's details.</div>
    </div>
  );
}

export default Searcharea;
