import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import UseGetcurrentuser from "./hooks/UseGetcurrentuser";
const App = () => {
  UseGetcurrentuser()
  return (
    
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
