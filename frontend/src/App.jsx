// App.jsx
import React from 'react';
import './App.css';
import Home from '@/pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;