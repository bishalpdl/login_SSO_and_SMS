import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Me = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    
    const getData = async() => {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/user/auth_test`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token') 
        }
      })
      console.log(response)
      setData(response?.data?._id)
      return ;

    }

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token){
            return navigate('/login')
        }
        getData();
      }, [])


    return (
      <div className="">
        <div className=" card text-center w-75 mx-auto my-5">
          <div className="card-body">
            <img
              src="https://img.icons8.com/dotty/80/null/moderator-male.png"
              style={{ height: "100px" }}
            />

            <h5 className="card-title">User</h5>
            <div className="text-muted">

              {data && <p>Your Unique Id: {data}</p>}

            </div>
            <p className="text-muted">Status: 🟢 Logged In</p>
            <button href="#" 
                className="btn btn-primary" 
                onClick={()=>{
                    localStorage.clear();
                    navigate('/login')
                }}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
}

export default Me;