import {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';

const UserRoute= ({children}) =>{

    const [ok, setOk] = useState(false);

    //router
    const router = useRouter()


    useEffect(() =>{
        const fetchUser = async () =>{
            try {
                const {data} = await axios.get('/api/current-user');
            
                if(data.ok) setOk(true);
            } catch (err) {
                console.log(err);
                setOk(false);
                router.push('/login')
            }
        };
        fetchUser();
    }, [])

    return (
        <>
      {!ok ? (<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p5"/>): (<>{children}</> ) }
        </>
    )
};

export default UserRoute;