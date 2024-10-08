import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import { TbTestPipe } from "react-icons/tb";

const Tests = () => {
    const url = localStorage.getItem("url");
    const [testName, setTestName] = useState('');
    const [testType, setTestType] = useState('');
    const [testCode, setTestCode] = useState('');
    const [allTests, setAllTests] = useState([]);
    const [showAddTestModal, setShowAddTestModal] = useState(false);
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const fetchTests = async () => {
        const res = await axios.get(`${url}/services/test/`);
        setAllTests(res.data);
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleAddTest =async(e)=>{
        e.preventDefault();
        const data = new FormData();
        if(testName){
            data.append('test_name', testName)
        }
        if(testType){
            data.append('test_type', testType)
        }
        if(testCode){
            data.append('test_code', testCode)
        }
        try{
            const res = await axios.post(`${url}/services/test/`,data);
            if(window.confirm("Add Test Configuration")){
                setShowAddTestModal(false);
                fetchTests();
                setTestName('');
                setTestCode('');
                setTestType('');
                setError('')
            }
        }catch(error){
            setError(error.response.data);
        }
    }

    return (
        <div>
            <div>
                <div className='container-fluid position-relative'>
                    <div className='position-absolute top-0 end-0'>
                        <button className='btn btn-primary' id='btn-back' type='button'
                            onClick={() => navigate('/dashboard/receptionist')}
                        >
                            <IoReturnUpBackSharp /> Back
                        </button>
                    </div>
                </div>
                <div className='container-fluid position-relative'>
                    <div className='position-absolute top-0'>
                        <button className='btn btn-primary' id='btn-back'  type='button'
                            onClick={() => setShowAddTestModal(true)}
                        >
                            <TbTestPipe /> Test Configuration
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className='container-fluid p-4'>
                <div className="table-responsive">
                    <table className="table table-striped table-light">
                        <thead className="thead" id='thead'>
                            <tr>
                                <th>Test Name</th>
                                <th>Test Type</th>
                                <th>Test Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTests.length > 0 ?
                                (allTests.map((test) => (
                                    <tr key={test.id}>
                                        <td>{test.test_name}</td>
                                        <td>{test.test_type}</td>
                                        <td>{test.test_code}</td>
                                    </tr>
                                )))
                                :
                                (
                                    <tr>
                                        <td colSpan="7" className="text-center">No Configurations Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {showAddTestModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Test</h5>
                                    <button type="button" className="close" onClick={() => setShowAddTestModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className='modal-body'>
                                    <form className='needs-validation'>
                                        <div className="form-group">
                                            <label>Test Name</label>
                                            <input
                                                type="text"
                                                name='test_name'
                                                className={`form-control ${error.test_name ? "is-invalid" : ""}`}
                                                value={testName}
                                                onChange={(e) =>setTestName(e.target.value)}
                                            />
                                            <div className='invalid-feedback'>
                                                {error.test_name && <p>{error.test_name}</p>}
                                            </div>
                                        </div>
                                        <div className='form-group'>
                                            <label>Test Categoty</label>
                                            <select
                                                className={`form-control ${error.test_type ? "is-invalid" : ""}`}
                                                name='test_type'
                                                value={testType}
                                                onChange={(e) => setTestType(e.target.value)}
                                            >
                                                <option value=''>Select test type</option>
                                                <option value='Test'>Test</option>
                                                <option value='Diagnostic'>Diagnostic</option>
                                            </select>
                                            <div className='invalid-feedback'>
                                                <p>Choose a test type</p>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Test Code</label>
                                            <input
                                                type="text"
                                                className={`form-control ${error.test_code ? "is-invalid" : ""}`}
                                                value={testCode}
                                                onChange={(e) =>setTestCode(e.target.value)}
                                            />
                                            <div className='invalid-feedback'>
                                                {error.test_code && <p>{error.test_code}</p>}
                                            </div>
                                        </div>
                                        <div className='modal-footer'>
                                            <button className='btn btn-primary' id='btn-back' onClick={handleAddTest}>Add Test</button>
                                            <button className='btn btn-primary' id='btn-back' onClick={()=>{setShowAddTestModal(false); setError('');}}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Tests