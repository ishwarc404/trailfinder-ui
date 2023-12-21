import React, { useState, useEffect } from 'react';
import MapGL, { Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Make sure to import default Mapbox GL styles

import './mapcomponent.css'
const MapComponent = ({ trailCoordsArray }) => {
    
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
    if (trailCoordsArray && trailCoordsArray.length > 0) {
      setLineData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: trailCoordsArray[0]
        }
      });

      setViewport({
        latitude: trailCoordsArray[0][0][1],
        longitude: trailCoordsArray[0][0][0],
        zoom: 14,
        attributionControl: true,
        interactive: true
      });

    }
  }, [trailCoordsArray]);


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
     key={trailCoordsArray.length}
      {...viewport}
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onMove={evt => setViewport(evt.viewport)}
      mapboxAccessToken={'pk.eyJ1IjoiaXNod2FyYzQwNCIsImEiOiJjbGY0czRwdTEwMDk2M3BqeGhxcmgxem55In0.es5t51shhzQiZqn7ldY9yw'}
      className = 'map'
    >
        
        {trailCoordsArray ? trailCoordsArray.map((trailCoords, index) => (
                    <React.Fragment key={index}>
                        <Source id={`trail-${index}`} type="geojson" data={{
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: trailCoords
                            }
                        }}>
                            <Layer id={`layer-${index}`} {...layerStyle} />
                        </Source>
                        
                        {/* Start and End Markers */}
                        <Marker longitude={trailCoords[0][0]} latitude={trailCoords[0][1]}>
                            <div style={{ color: '#08FF08' }}>⬤</div>
                        </Marker>
                        <Marker longitude={trailCoords[trailCoords.length - 1][0]} latitude={trailCoords[trailCoords.length - 1][1]}>
                            <div style={{ color: 'black' }}>⬤</div>
                        </Marker>
                    </React.Fragment>
                )) : 
                ''}

    </MapGL>

   </div>
  );
};

export default MapComponent;
