import {useState,useEffect} from 'react';

const DoctorProfile = () => {
    const access_token = localStorage.getItem('access')
    const [profile,setProfile] = useState({});

    useEffect(()=>{
        const fetchProfile =async()=>{
            const response = await axios.get("http://127.0.0.1:8000/api/doctor/profile/",{
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            setProfile(response.data)
        };
        fetchProfile();
    },[])

    return (
        <div>

        </div>
    )
}

export default DoctorProfile