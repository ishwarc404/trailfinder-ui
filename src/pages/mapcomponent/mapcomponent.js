import React, { useState, useEffect } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Make sure to import default Mapbox GL styles

import './mapcomponent.css'
const MapComponent = ({ trailCoords }) => {
    
    const [viewport, setViewport] = useState({
    latitude: 40.014984,
    longitude: -105.270546,
    zoom: 12,
    attributionControl: true,
    interactive: true
  });

  const [lineData, setLineData] = useState({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  });

  useEffect(() => {
    if (trailCoords && trailCoords.length > 0) {
      setLineData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: trailCoords
        }
      });

      setViewport({
        latitude: trailCoords[0][1],
        longitude: trailCoords[0][0],
        zoom: 14,
        attributionControl: true,
        interactive: true
      });

    }
  }, [trailCoords]);


  const layerStyle = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': '#ff051a',
      'line-width': 5
    }
  };

  return (
   <div className='mapcomponent'>
     <MapGL
      {...viewport}
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onMove={evt => setViewport(evt.viewport)}
      mapboxAccessToken={'pk.eyJ1IjoiaXNod2FyYzQwNCIsImEiOiJjbGY0czRwdTEwMDk2M3BqeGhxcmgxem55In0.es5t51shhzQiZqn7ldY9yw'}
      className = 'map'
    >
        
      <Source id="my-data" type="geojson" data={lineData}>
        <Layer {...layerStyle} />
      </Source>
    </MapGL>

   </div>
  );
};

export default MapComponent;
