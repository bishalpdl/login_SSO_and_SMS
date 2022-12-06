import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OAuth from "./oAuth";
import validator from "validator";

const Login = () => {

    const [detailSelection, setDetailSelection] = useState('email')
    const [phone, setPhone] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null)
    
    const navigate = useNavigate();

    useEffect(()=>{
        document.getElementById(detailSelection).value = ''
    },[detailSelection])

    useEffect(()=>{
      setError(null)
    }, [phone, email, password])

    const handleRadioSelect = (e) => {
        setDetailSelection(e.target.value);
        if(e.target.value === 'email'){
            setPhone(null)
        }
        if(e.target.value === 'phone'){
            setEmail(null)
        }
    }

    const getChecked = (val) => {
        if(val===detailSelection){
            return 'selected';
        }else{
            return '';
        }
    }

    const getLabel = () => {
        if(detailSelection === 'email'){
            return 'Email Address'
        }
        if(detailSelection === 'phone'){
            return 'Phone Number'
        }
    }

    const handleInfoChange = (e) => {
        console.log(e.target.id)
        if(e.target.id === 'email'){
            setEmail(e.target.value);
            setPhone(null)
        }
        if(e.target.id === 'phone'){
            setPhone(e.target.value);
            setEmail(null)
        }
    }

    const registerSubmit = async() => {
        if(password && (phone || email)){
          console.log('data fulfilled')
          const data = {
            email, phone, password
          }
          
          if(detailSelection === "email"){
            const isEmail = validator.isEmail(email);
            if(!isEmail){
              return setError('Please enter an Email in Proper Format.')
            }
          }

          const response = await axios.post(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/user/login` , data )
          console.log(response);
          if(response.data.status==='failure'){
            setError(response.data.msg)
          }else{
            setError(null);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('phone',  phone)
            localStorage.setItem('email',  email)
            navigate('/me')
          }
  
        }else{
          console.log('data unfullfilled');
          setError('Fill all Fields')
        }
      }



    return(
        <div>
            <div className="p-5  mx-auto my-5 border border-default" style={{width: '500px'}}>
            
            <div className='h3 d-flex align-items-center justify-content-center mb-5 '>Login</div>
            <div className=' d-flex align-items-center justify-content-center mb-5 '>
                Not Register?&nbsp;<a href='/register'>Register Now</a>
            </div>
          
          <div onChange={handleRadioSelect}>
            <div className="form-check form-check-inline ">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                value="email"
                checked={getChecked("email")}
              />
              Email Address
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                value="phone"
                checked={getChecked("phone")}
              />
              Phone Number
            </div>
          </div>

          <div className="form-group mt-2">
            <label htmlFor="email">{getLabel()}*</label>

            <div className="d-flex flex-row">
              <input
                type= {detailSelection==='phone' ? "Number" : "text"}
                className="form-control me-2 input-text"
                id={detailSelection}
                onChange={handleInfoChange}
              />

            </div>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="pwd">Password* <a href="/forgot_password"> forgot password?</a></label>
            <input type="password" className="form-control" id="pwd" onChange={(e)=>{setPassword(e.target.value)}}/>
          </div>

          <div className="form-group mt-2 text-danger fst-italic">
            {error && error}
          </div>


          <button type="submit" className={`btn btn-danger mt-2 p-2`}
            onClick={registerSubmit}
          >
            Login
          </button>
        <OAuth />
        </div>
        </div>
    )
}

export default Login;