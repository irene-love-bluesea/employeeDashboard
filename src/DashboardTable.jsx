import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import './DashboardTable.css';

const DashboardTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.dashboardData;

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_dashboard.xlsx");
  };

  const handleDownloadPNG = () => {
    const tableNode = document.getElementById('dashboard-table');

    htmlToImage.toPng(tableNode).then((dataUrl) => {
      download(dataUrl, 'Employee_dashboard.png');
    }).catch((err) => {
      console.error('Error generating PNG:', err);
    });
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="table-wrapper">
        <h3>No employee data available to display</h3>
        <p>Please Double Check your Data or Files!!</p>
        <button className="backbtn" onClick={handleGoBack}>Go Back to Upload</button>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div><h2 className="dashboard-heading">New Employee Dashboard</h2></div>       
        <div className="download-buttons">
          <div><button onClick={handleDownloadExcel}>Download Excel</button></div>
          <div><button onClick={handleDownloadPNG}>Download PNG</button></div>
        </div>
      </div>

      <table className="dashboard-table" id="dashboard-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Employee Name</th>
            <th>Join Date</th>
            <th>Role</th>
            <th>Team Member</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.name}</td>
              <td>{row.joinDate}</td>
              <td>{row.role}</td>
              <td>{row.teamMember}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="backbtn" onClick={handleGoBack}>Go Back to Upload</button>
    </div>
  );
};

export default DashboardTable;
