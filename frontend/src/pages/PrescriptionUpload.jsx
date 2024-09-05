import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrescriptionUpload = () => {
    const url = localStorage.getItem('url');
    const [file, setFile] = useState(null);
    const [patient, setPatient] = useState('');
    const [doctor, setDoctor] = useState('');
    const [doctors,setDoctors] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            const res = await axios.get(`${url}/services/test/`);
            setTests(res.data);
        };
        fetchTests();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file || !patient || !doctor) {
            alert('Please fill out all fields and select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('patient', patient);
        formData.append('doctor', test);
        formData.append('prescription_file', file);

        try {
            const response = await axios.post(`${url}/services/upload/report/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully!');
            setFile(null);
            setPatient('');
            setTest('');
            document.getElementById('upload-form').reset();
        } catch (error) {
            console.error('There was an error uploading the file!', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Upload Report</h4>
                        </div>
                        <div className="card-body">
                            <form id="upload-form" onSubmit={handleUpload}>
                                <div className="form-group">
                                    <label>Patient UHID</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="patient"
                                        value={patient}
                                        id="patient"
                                        placeholder="Enter Patient UHID"
                                        onChange={(e) => setPatient(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Test</label>
                                    <select
                                        className="form-control"
                                        name="test"
                                        id="test"
                                        value={test}
                                        onChange={(e) => setTest(e.target.value)}
                                    >
                                        <option value="">Select Test</option>
                                        {tests.map((test) => (
                                            <option key={test.id} value={test.id}>
                                                {test.test_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Upload Report</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="file"
                                        id="file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Upload
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionUpload;
