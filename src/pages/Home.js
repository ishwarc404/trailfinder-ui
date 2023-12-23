import React, { useEffect, useState } from 'react';
import Header from './header/header';
import Searcharea from './searcharea/searcharea';
import MapComponent from './mapcomponent/mapcomponent';
import './home.css';
import Toolbar from './toolbar/toolbar';

function Home() {
  const [selectedTrailCoords, setSelectedTrailCoords] = useState([]);


  return (
    <div className='home'>
      <Header />
      <br />
      <div className='d-flex justify-content-center'>
        <div>
          <Searcharea onTrailSelect={setSelectedTrailCoords} />
        </div>
        <div>
          
            <Toolbar trailCoords={selectedTrailCoords}/>
          
            <MapComponent trailCoords={selectedTrailCoords}/>
        </div>
      </div>
    </div>
  );
}

export default Home;
