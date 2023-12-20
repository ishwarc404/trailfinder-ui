import './searcharea.css';
import React from "react";

import { Slider } from "@nextui-org/react";
import {Button} from "@nextui-org/react";


function Searcharea() {

  const [distanceValue, setDistanceValue] = React.useState([2, 13]);
  const [elevationGainValue, setGainValue] = React.useState([50, 150]);


  return (
    <div className='searcharea'>

      <div className='search-parent'>

        <span className='search-heading'>
          SEARCH
        </span>

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
          <Button color="default" varient="flat">
          Search
           </Button> 
        </div>
      </div>

    </div>
  );
}

export default Searcharea;
