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
import ProtectedRoute from './ProtectedRoute'; // 🔥 IMPORT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path='/' element={<App />} />

        <Route
          path='/admin'
          element={
            <ProtectedRoute role="Admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reader'
          element={
            <ProtectedRoute role="Reader">
              <Reader />
            </ProtectedRoute>
          }
        />

        <Route
          path='/officer'
          element={
            <ProtectedRoute role="Officer">
              <Officer />
            </ProtectedRoute>
          }
        />

        <Route
          path='/court/:id'
          element={
            <ProtectedRoute>
              <CourtInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path='/document-preview'
          element={
            <ProtectedRoute>
              <DocumentPreview />
            </ProtectedRoute>
          }
        />

        <Route
          path='/newdocdocuments'
          element={
            <ProtectedRoute>
              <NewDocDocuments />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);