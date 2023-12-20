import './searcharea.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import { Slider } from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import {Tabs, Tab} from "@nextui-org/react";
import {Listbox, ListboxItem} from "@nextui-org/react";
import {ListboxWrapper} from "./ListboxWrapper";


function Searcharea({ onTrailSelect }) {

  const [distanceValue, setDistanceValue] = useState([2, 13]);
  const [elevationGainValue, setGainValue] = useState([50, 150]);
  const [trails, setTrails] = useState([]); // State to store the trails
  const [selectedTrail, setSelectedTrail] = useState([]);

  function fetchTrails() {
    // Define the JSON object to send
    const params = {
      distance: distanceValue,
      elevationGain: elevationGainValue
    };

    // Use a POST request if you want to send a JSON object in the request body
    axios.post("http://127.0.0.1:5000/get-trails")
      .then(response => {
        // Handle the response data (list of trails)
        setTrails(response.data);
      })
      .catch(error => {
        // Handle any errors here
        console.error('There was an error fetching the trails', error);
      });
  }

  function handleTrailSelect(key) {
    console.log(key)
    for(let i = 0; i < trails.length ; i ++){
      if(trails[i]["id"] == key){
      onTrailSelect(trails[i]["coordinates"]); // Use the coordinates property
    }
    }
    // const selectedItem = trails.find(trail => trail["id"] == key); // Assuming each trail has a unique 'id' property
    // console.log(selectedItem); // Check the structure of the selected trail item
  
    // if (selectedItem && selectedItem.coordinates) {
    // } else {
    //   console.error('Selected trail item does not have coordinates property');
    // }
  }
  


  return (
    <div className='searcharea'>

      <Tabs aria-label="Tabs sizes">
          <Tab key="search" title="Search"/>
          <Tab key="simulate" title="Race Simulator"/>
      </Tabs>

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
            minValue={1}
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

        <div  className='search-button'>
          <Button 
          color="default" 
          varient="flat"
          onClick={fetchTrails}
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
              Distance: {(item.distance / 1000).toFixed(1) } km
              Elevation: {Math.round(item.elevation) }
            </ListboxItem>
          )}
        </Listbox>
      </div>

    </div>
  );
}

export default Searcharea;
