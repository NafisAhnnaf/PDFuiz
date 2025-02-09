import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router';
import axios from 'axios';
import Landing from './Pages/Landing';
import Processing from './Pages/Processing';
import Assessment from './Pages/Assessment';
import Result from './Pages/Result';


const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Landing/>} ></Route>
                <Route path='/Processing' element={<Processing/>} ></Route>
                <Route path='/Assessment' element={<Assessment/>}></Route>
                <Route path='/Result' element={<Result/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
