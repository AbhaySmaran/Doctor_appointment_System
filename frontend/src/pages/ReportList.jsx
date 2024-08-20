import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportList = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/services/upload/report/');
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Reports List</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Report Name</th>
                        <th>Patient</th>
                        <th>Test</th>
                        <th>Uploaded On</th>
                        <th>Uploaded By</th>
                        <th>Report File</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td>{report.name}</td>
                            <td>{report.patient}</td>
                            <td>{report.test}</td>
                            <td>{new Date(report.uploaded_on).toLocaleString()}</td>
                            <td>{report.uploaded_by}</td>
                            <td>
                                <a href={`http://127.0.0.1:8000${report.report_file}`} target="_blank" rel="noopener noreferrer">
                                    View Report
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportList;
