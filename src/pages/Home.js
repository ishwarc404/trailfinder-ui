import React, { useState } from 'react';
import Header from './header/header';
import Searcharea from './searcharea/searcharea';
import MapComponent from './mapcomponent/mapcomponent';
import './home.css';
import Toolbar from './toolbar/toolbar';
import { Tabs, Tab } from "@nextui-org/react";
import ElevationProfile from './elevationprofile/elevationprofile';

function Home() {
    const [selectedTrailCoords, setSelectedTrailCoords] = useState([]);
    const [activeTab, setActiveTab] = useState("search");

    const handleTabChange = () => {
        setSelectedTrailCoords([]);
    };

    return (
        <div className='home'>
            <Header />
            <br />
            <div className='tabs d-flex justify-content-center'>
                <Tabs aria-label="Tabs sizes"            
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}>

                    <Tab key="search" title="Search" />
                    <Tab key="simulate" title="Race Simulator" />
                </Tabs>
            </div>

            {activeTab != "simulate" ?
            <div className='d-flex justify-content-center'>
                <div>
                    <Searcharea onTrailSelect={setSelectedTrailCoords} />
                </div>
                <div>
                    <MapComponent 
                        trailCoords={selectedTrailCoords} 
                        className={activeTab === "simulate" ? "map-simulator" : ""}
                    />
                    <Toolbar trailCoords={selectedTrailCoords} />
                </div>
            </div>
            : 
            <div className='d-flex justify-content-center'>
                <div>
                     <ElevationProfile  onTrailSelect={setSelectedTrailCoords} /> 
                </div>
                <div>
                    <MapComponent 
                        trailCoords={selectedTrailCoords} 
                        className={activeTab === "simulate" ? "map-simulator" : ""}
                    />
                    <Toolbar trailCoords={selectedTrailCoords} />
                </div>
            </div>
            }
        </div>
    );
}

export default Home;
