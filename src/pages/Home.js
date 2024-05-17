import React, { useEffect, useState } from 'react';
import Header from './header/header';
import Searcharea from './searcharea/searcharea';
import MapComponent from './mapcomponent/mapcomponent';
import './home.css';
import Toolbar from './toolbar/toolbar';
import { Tabs, Tab } from "@nextui-org/react";
import ElevationProfile from './elevationprofile/elevationprofile';
import axios from 'axios'

function Home() {
    const [selectedTrailCoords, setSelectedTrailCoords] = useState([]);
    const [activeTab, setActiveTab] = useState("search");

    const handleTabChange = () => {
        setSelectedTrailCoords([]);
    };

    useEffect(()=>{
        axios.get("https://trailfinder.fly.dev")
        .then(response => {
        })
        .catch(error => {  
        });
    }
    ,[])

    return (
        <div className='home'>
              <MapComponent 
                    />
        </div>
    );
}

export default Home;
