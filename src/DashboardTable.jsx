import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DashboardTable.css';

const DashboardTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.dashboardData;

  const handleGoBack = () => {
    navigate('/', { replace: true });
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
      <h2 className="dashboard-heading">New Employee Dashboard</h2>
      <table className="dashboard-table">
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
