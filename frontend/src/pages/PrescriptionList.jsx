import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoReturnUpBackSharp } from "react-icons/io5";

const PrescriptionList = () => {
    const base_url = localStorage.getItem('url');
    const { uuid } = useParams();
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [patient, setPatient] = useState({});
    const access = localStorage.getItem('access');
    const navigate = useNavigate();

    const fetchPatient = async () => {
        try {
            const response = await axios.get(`${base_url}/api/patients/${uuid}/`)
            setPatient(response.data)
        } catch (error) {
            console.error(error.response.data);
        }
    }

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${base_url}/services/prescriptions/${uuid}/`, {
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
        fetchPatient();
    }, [uuid]);

    const onBackClick = () => {
        navigate(-1);
    };

    const handleDownload = async (fileUrl) => {
        try {
            // Make a request to get the file blob
            const response = await axios.get(`${base_url}${fileUrl}`, {
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
            
            <div className='container'>
                <h4>Prescriptions List</h4>
                <input
                    type="text"
                    id="search-input"
                    className="form-control mb-3"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className='row mb-3'>
                    <div className='col-md-4'>
                        <p><strong>Patient UHID: </strong>{patient.uuid}</p>
                    </div>
                    <div className='col-md-5'>
                        <p><strong>Patient's Name: </strong>{patient.full_name}</p>
                    </div>
                    <div className='col-md-3'>
                        <p><strong>Patient's Age: </strong>{patient.age}</p>
                    </div>
                </div>

                <table className="table table-striped table-light">
                    <thead className='thead'>
                        <tr>
                            <th>Doctor's Name</th>
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
                                    <td>{report.doctor.full_name}</td>
                                    {/* <td>{report.message}</td> */}
                                    <td>
                                        <FaCloudDownloadAlt
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            onClick={() => handleDownload(report.prescription_file)}
                                        />
                                        <a href={`${base_url}${report.prescription_file}`} target="_blank" rel="noopener noreferrer">
                                            View Report
                                        </a>
                                    </td>
                                    <td>{new Date(report.uploaded_on).toLocaleString()}</td>
                                    <td>{report.uploaded_by}</td>
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
        </div>
    );
};

export default PrescriptionList;
