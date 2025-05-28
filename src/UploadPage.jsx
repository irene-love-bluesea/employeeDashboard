import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
    const [dailyReports, setDailyReports] = useState([]);
    const [newEmployees, setNewEmployees] = useState([]);
    const [dashboardData, setDashboardData] = useState([]);
    const [reportFileReady, setReportFileReady] = useState(false);
    const [employeeFileReady, setEmployeeFileReady] = useState(false);
    const navigate = useNavigate();

    const handleDailyReportsUpload = (event) => {
        const files = event.target.files;
        if (files) {
            setReportFileReady(true);
        }
        const allPromises = Array.from(files).map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(sheet);
                    const teamMember = file.name.split('_').slice(2).join(' ').replace(/\.xls[x]?$/, '').replace(/_/g, ' ');

                    const passed = json
                        .filter((row) => row.Interview === 'Yes' && row.Status === 'Pass')
                        .map((row) => ({ ...row, teamMember }));

                    resolve(passed);
                };
                reader.readAsArrayBuffer(file);
            });
        });

        Promise.all(allPromises).then((results) => {
            const allReports = results.flat();
            console.log("Daily Reports parsed:", allReports);
            setDailyReports(allReports);
        });
    };

    const handleNewEmployeeUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEmployeeFileReady(true);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            console.log("New Employees parsed:", json);
            setNewEmployees(json);
        };
        reader.readAsArrayBuffer(file);
    };

    const normalize = (str) => str?.toString().trim().toLowerCase();

    useEffect(() => {
        if (dailyReports.length > 0 && newEmployees.length > 0) {
            const matched = [];

            newEmployees.forEach((emp) => {
                const match = dailyReports.find((rep) => {
                    const isMatch =
                        normalize(rep['Candidate Name']) === normalize(emp['Employee Name']) &&
                        normalize(rep['Role']) === normalize(emp['Role']);
                    return isMatch;
                });

                if (match) {

                    const formatDate = (serial) => {
                        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                        const date = new Date(excelEpoch.getTime() + serial * 86400000);
                        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    };



                    matched.push({
                        name: emp['Employee Name'],
                        joinDate: formatDate(emp['Join Date']),
                        role: emp['Role'],
                        teamMember: match.teamMember,
                    });
                }
            });
            console.table(matched);

            setDashboardData(matched);
        }
    }, [dailyReports, newEmployees]);

    const handleGenerateDashboard = () => {
        if (!employeeFileReady || !reportFileReady) {
            alert("Please choose all the files first!");
        } else
        {
            navigate('/dashboard', { state: { dashboardData } });
        }

    };

    return (
        <div className="container">
            <h1 className="title">Employee Dashboard Generator</h1>
            <div className="upload-section">
                <div>
                    <label>Upload Daily Report Files: </label>
                    <input type="file" multiple accept=".xls,.xlsx" onChange={handleDailyReportsUpload} />
                </div>
                <div>
                    <label>Upload New Employee File: </label>
                    <input type="file" accept=".xls,.xlsx" onChange={handleNewEmployeeUpload} />
                </div>
                <button onClick={handleGenerateDashboard} className="btn">Generate Dashboard</button>
            </div>
        </div>
    );
};

export default UploadPage;
