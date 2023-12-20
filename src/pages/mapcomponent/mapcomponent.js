import React, { useState, useEffect } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Make sure to import default Mapbox GL styles

import './mapcomponent.css'
const MapComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.014984,
    longitude: -105.270546,
    zoom: 12,
    attributionControl: true,
    interactive: true
  });

  
  // Define the GeoJSON object for the polyline
  const lineData = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [-105.3081339, 39.9935708], [-105.3080418, 39.9935211], [-105.308022, 39.9933642], [-105.3079392, 39.9932273], [-105.3077233, 39.9930041], [-105.3073537, 39.9927547], [-105.307094, 39.992491], [-105.3067785, 39.9923217], [-105.3063044, 39.9918131], [-105.3060796, 39.9917691], [-105.3059692, 39.9916999], [-105.3058654, 39.9914894], [-105.3053727, 39.9910843], [-105.3052607, 39.9909411], [-105.3052061, 39.9907418], [-105.3051943, 39.9905486], [-105.3051706, 39.9903629], [-105.3051883, 39.9901102], [-105.3051883, 39.9901102], [-105.3054407, 39.9897611], [-105.3057449, 39.989937], [-105.3062103, 39.9900505], [-105.3063151, 39.9903129], [-105.3063894, 39.9903214], [-105.3065386, 39.9902018], [-105.3067442, 39.9901276], [-105.3068531, 39.9899294], [-105.3069466, 39.989677], [-105.3070727, 39.9895485], [-105.3070927, 39.989423], [-105.3070556, 39.9892832], [-105.3069453, 39.9891877], [-105.3068832, 39.9884199], [-105.3066445, 39.9879532], [-105.3062223, 39.987716], [-105.3057747, 39.9875996], [-105.3056489, 39.9876686], [-105.3055424, 39.9874551], [-105.3053479, 39.9874664], [-105.305241, 39.987364], [-105.3052432, 39.9872367], [-105.3050748, 39.9872061], [-105.3051033, 39.9869802], [-105.304963, 39.9869808], [-105.3047479, 39.9867655], [-105.3046875, 39.9865272], [-105.304493, 39.9862403], [-105.304395, 39.986166], [-105.3043726, 39.9861976], [-105.3042187, 39.9860498], [-105.3040547, 39.985684], [-105.3040615, 39.9854908], [-105.303976, 39.9854324], [-105.3040003, 39.9853483], [-105.30386, 39.9851257], [-105.3037699, 39.9848318], [-105.3037041, 39.9847525], [-105.3036432, 39.9848337], [-105.3035423, 39.9848531], [-105.3034489, 39.9847657], [-105.3034796, 39.9843703], [-105.3033063, 39.9844473], [-105.3033021, 39.9843467], [-105.3030886, 39.9844117], [-105.3029503, 39.9844022], [-105.3026113, 39.9843781], [-105.3025446, 39.9843154], [-105.3026966, 39.9842541], [-105.3029394, 39.9841661], [-105.3031567, 39.9839866], [-105.3032257, 39.9838787], [-105.3032176, 39.9836076], [-105.3034315, 39.9832759], [-105.3036944, 39.9830329], [-105.3037826, 39.9829492], [-105.3039041, 39.9828283], [-105.3039041, 39.9828283], [-105.3039981, 39.9827994], [-105.3042606, 39.9826305], [-105.3044081, 39.9825962], [-105.3044081, 39.9825962], [-105.3045303, 39.9825878], [-105.3046058, 39.982599], [-105.3046412, 39.9826205], [-105.3046657, 39.9826075], [-105.3045746, 39.9824983], [-105.3043495, 39.9824327], [-105.3041226, 39.9823901], [-105.3040033, 39.9823224], [-105.303928, 39.982218], [-105.3038064, 39.9820886], [-105.3037259, 39.9819116], [-105.3036708, 39.9818202], [-105.3036473, 39.981657], [-105.3036341, 39.9815365], [-105.3035573, 39.9814147], [-105.3035256, 39.9812726], [-105.3034137, 39.9811784], [-105.3034027, 39.9811645], [-105.3033641, 39.9811122], [-105.3033341, 39.9808657], [-105.3032991, 39.9806492], [-105.303197, 39.9803889], [-105.3030873, 39.9801831], [-105.3030307, 39.9801214], [-105.3030403, 39.9800391], [-105.3032334, 39.980194], [-105.3034048, 39.9803835], [-105.3035262, 39.9805875], [-105.303636, 39.9808183], [-105.303734, 39.9809203], [-105.3039344, 39.9809611], [-105.3040128, 39.9809909], [-105.3040446, 39.9810473], [-105.3040526, 39.981099], [-105.3040796, 39.9812566], [-105.3041053, 39.9813622], [-105.3042944, 39.981491], [-105.3043726, 39.9815184], [-105.3044532, 39.9815035], [-105.3045627, 39.9814695]
    ]
                 
    }
  };

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