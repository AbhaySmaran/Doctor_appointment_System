import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoReturnUpBackSharp } from "react-icons/io5";

const ReportList = () => {
    const { uuid } = useParams();
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const access = localStorage.getItem('access');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/services/reports/${uuid}/`, {
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                });
                setReports(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, [uuid]);

    const onBackClick = () => {
        navigate(-1);
    };

    const handleDownload = async (fileUrl) => {
        try {
            // Make a request to get the file blob
            const response = await axios.get(`http://127.0.0.1:8000${fileUrl}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                },
                responseType: 'blob' // Important: This tells axios to expect a binary file
            });

            // Create a temporary URL to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileUrl.split('/').pop()); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link); // Clean up
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const filteredReports = reports.filter(report => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const patientName = report.patient.full_name.toLowerCase();
        const reportName = report.name.toLowerCase();
        const uploadDate = new Date(report.uploaded_on).toLocaleString().toLowerCase();
        const patientUHID = report.patient.uuid.toLowerCase();

        return (
            patientName.includes(lowerCaseQuery) ||
            reportName.includes(lowerCaseQuery) ||
            uploadDate.includes(lowerCaseQuery) ||
            patientUHID.includes(lowerCaseQuery)
        );
    });

    return (
        <div className="container fluid position-relative ">
            <div className='position-absolute top-0 end-0'>
                <button type='button' className='btn btn-primary' id='btn-back' onClick={onBackClick}>
                    <IoReturnUpBackSharp /> Back
                </button>
            </div>
            <br />
            <br />
            <input
                type="text"
                id="search-input"
                className="form-control mb-3"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <h2>Reports List</h2>
            <table className="table table-striped table-light">
                <thead className='thead'>
                    <tr>
                        <th>Patient Name</th>
                        <th>Patient UHID</th>
                        <th>Report Name</th>
                        {/* <th>Messege</th> */}
                        <th>Download</th>
                        <th>Uploaded On</th>
                        <th>Uploaded By</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                            <tr key={report.id}>
                                <td style={{ maxWidth: '200px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                    {report.patient.full_name}
                                </td>
                                <td style={{ maxWidth: '200px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                    {report.patient.uuid}
                                </td>
                                <td style={{ maxWidth: '200px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                    {report.name}
                                </td>
                                {/* <td style={{ maxWidth: '200px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                    {report.message}
                                </td> */}
                                <td>
                                    <FaCloudDownloadAlt
                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                        onClick={() => handleDownload(report.report_file)}
                                    />
                                    <a href={`http://127.0.0.1:8000${report.report_file}`} target="_blank" rel="noopener noreferrer">
                                        View Report
                                    </a>
                                </td>
                                <td style={{ maxWidth: '200px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                    {new Date(report.uploaded_on).toLocaleString()}
                                </td>
                                <td style={{ maxWidth: '200px', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                    {report.uploaded_by}
                                </td>
                            </tr>

                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No reports found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportList;
