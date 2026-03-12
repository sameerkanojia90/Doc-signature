import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Admin from './component/Admin.jsx';
import Reader from './pages/Reader.jsx';
import Officer from './pages/Officers.jsx';
import CourtInfo from './component/CourtInfo.jsx';
import DocumentPreview from './component/reader/DocumentPreview.jsx';
import NewDocDocuments from './component/reader/NewDocDocuments.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/reader' element={<Reader />} />
        <Route path='/officer' element={<Officer />} />
        <Route path='/court/:id' element={<CourtInfo />} />
        <Route path='/document-preview' element={<DocumentPreview />} /> 
        <Route path='/newdocdocuments' element={<NewDocDocuments />} />  
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
