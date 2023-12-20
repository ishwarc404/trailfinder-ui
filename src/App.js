import './App.css';

import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home'

import {NextUIProvider} from "@nextui-org/react";


function App() {


  return (
    <NextUIProvider>
      <Router>
        <Routes>
            <Route path="*" element={<Home/>}/>
        </Routes>
      </Router>
      </NextUIProvider>

  );
}

export default App;
