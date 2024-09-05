import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const SupportIssues = () => {
    const url = localStorage.getItem('url');
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('name');
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [formData, setFormData] = useState({
        Customer_Name: '',
        Customer_ID: '',
        Issue_Caption: 'Screen Issue',
        Issue_Description: '',
        Priority: 'low',
        Status: 'Open',
        Issue_ScreenShot: null,
    });

    const fetchIssues = async () => {
        const res = await axios.get(`${url}/api/issue/support/`);
        setIssues(res.data);
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'Issue_ScreenShot') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleIssueSelect = (issue) => {
        setSelectedIssue(issue);
        setStatus(issue.Status); // Set the initial status in the modal
    };

    const handleSupportSubmit = async () => {
        const reportData = new FormData();
        reportData.append("Customer_Name", 'Dr. Ranjan Mahanty');
        reportData.append("Customer_ID", "C1");
        reportData.append("Issue_Caption", formData.Issue_Caption);
        reportData.append("Issue_Description", formData.Issue_Description);
        reportData.append("Priority", formData.Priority);
        reportData.append("Issue_Status", formData.Status);
        reportData.append("created_by", user);
        if (formData.Issue_ScreenShot) {
            reportData.append("Issue_ScreenShot", formData.Issue_ScreenShot);
        }

        try {
            const res = await axios.post(`${url}/api/issue/support/`, reportData);
            alert('Issue Submitted');
            setShowSupportModal(false);
            fetchIssues();
            setUploadError(null);
        } catch (error) {
            setUploadError(error.response.data);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await axios.put(`${url}/api/issue/support/${selectedIssue.Ticket_id}/`, { Status: status });
            alert('Issue status updated');
            setShowStatusModal(false);
            fetchIssues();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => navigate('/dashboard/receptionist')}
                    >
                        <IoReturnUpBackSharp /> Back
                    </button>
                </div>
                <div className='position-absolute top-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => setShowSupportModal(true)}
                    >
                        Raise Ticket
                    </button>
                </div>
            </div>
            <div className='container-fluid p-5'>
                <h4>Issues</h4>
                {role === 'super_admin' ?
                    <div className='table-responsive'>
                        <table className='table table-striped table-light'>
                            <thead className='thead'>
                                <tr>
                                    <th>Select</th>
                                    <th>Issue Caption</th>
                                    <th>Issue Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Occured On</th>
                                    <th>Uploaded By</th>
                                    <th>Issue ScreenShot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue.Ticket_id}>
                                        <td>
                                            <input
                                                type="radio"
                                                name="issue"
                                                value={issue.Ticket_id}
                                                onChange={() => handleIssueSelect(issue)}
                                            />
                                        </td>
                                        <td>{issue.Issue_Caption}</td>
                                        <td>{issue.Issue_Description}</td>
                                        <td>{issue.Priority}</td>
                                        <td>{issue.Status}</td>
                                        <td>{issue.Created_Date}</td>
                                        <td>{issue.created_by}</td>
                                        <td>
                                            {(issue.Issue_ScreenShot !== null) ? <a href={`${url}${issue.Issue_ScreenShot}`} target="_blank" rel="noopener noreferrer">
                                                View ScreenShot
                                            </a> :
                                                <p>No ScreenShot</p>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedIssue && (
                            <div>
                                <button className='btn btn-primary' onClick={() => setShowStatusModal(true)}>Status Updadte</button>
                            </div>
                        )}
                    </div>
                    :
                    <div className='table-responsive'>
                        <table className='table table-striped table-light'>
                            <thead className='thead'>
                                <tr>
                                    <th>Issue Caption</th>
                                    <th>Issue Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Occured On</th>
                                    <th>Issue ScreenShot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue.Ticket_id}>
                                        <td>{issue.Issue_Caption}</td>
                                        <td>{issue.Issue_Description}</td>
                                        <td>{issue.Priority}</td>
                                        <td>{issue.Status}</td>
                                        <td>{issue.Created_Date}</td>
                                        <td>
                                            {(issue.Issue_ScreenShot !== null) ? <a href={`${url}${issue.Issue_ScreenShot}`} target="_blank" rel="noopener noreferrer">
                                                View ScreenShot
                                            </a> :
                                                <p>No ScreenShot</p>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>

            {/* Support Modal */}
            {showSupportModal && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">Support</h5>
                                <button type="button" className="close" onClick={() => setShowSupportModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className='modal-body'>
                                <form className='needs-validation'>
                                    <div className='form-group'>
                                        <label>Issue Caption</label>
                                        <select
                                            className='form-control'
                                            name='Issue_Caption'
                                            value={formData.Issue_Caption}
                                            onChange={handleChange}
                                        >
                                            <option value='Screen Issue'>Screen Issue</option>
                                            <option value='Technical Issue'>Technical Issue</option>
                                            <option value='Other'>Any Other</option>
                                        </select>
                                    </div>
                                    <div className='form-group'>
                                        <label>Issue Description</label>
                                        <textarea
                                            className={`form-control ${uploadError.Issue_Description ? 'is-invalid' : ""}`}
                                            name="Issue_Description"
                                            value={formData.Issue_Description}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="validation-feedback">
                                            {uploadError.Issue_Description ? <p>{uploadError.Issue_Description}</p> : " "}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Priority</label>
                                        <select
                                            className='form-control'
                                            name="Priority"
                                            value={formData.Priority}
                                            onChange={handleChange}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className='form-group'>
                                        <label>Upload Screenshot</label>
                                        <input
                                            className='form-control'
                                            type="file"
                                            name="Issue_ScreenShot"
                                            accept='image/*'
                                            onChange={handleChange}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowSupportModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSupportSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && selectedIssue && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">Update Status</h5>
                                <button type="button" className="close" onClick={() => setShowStatusModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className='modal-body'>
                                <div className='form-group'>
                                    <label>Status</label>
                                    <select
                                        className='form-control'
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In-Progress">In-Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">closed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowStatusModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleStatusUpdate}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportIssues;
