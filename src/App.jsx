import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './UploadPage';
import Layout from './Layout';
import DashboardTable from './DashboardTable';
import './App.css';

const App = () => {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardTable />} />
      </Routes>
      </Layout>
    </Router>
  );
};

export default App;
