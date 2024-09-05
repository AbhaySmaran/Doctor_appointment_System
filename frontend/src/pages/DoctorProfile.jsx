import {useState,useEffect} from 'react';

const DoctorProfile = () => {
    const url = localStorage.getItem('url');
    const access_token = localStorage.getItem('access')
    const [profile,setProfile] = useState({});

    useEffect(()=>{
        const fetchProfile =async()=>{
            const response = await axios.get(`${url}/api/doctor/profile/`,{
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