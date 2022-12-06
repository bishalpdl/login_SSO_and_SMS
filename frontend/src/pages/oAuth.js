import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { FacebookProvider, LoginButton } from 'react-facebook';
import FacebookLogin from 'react-facebook-login';



const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID

const OAuth = () => {
    const [OAuthError, setOAuthError] = useState()
    const navigate = useNavigate();

    const onGoogleSuccess = async(response) => {
        console.log(response)
        try{
            const data = {
                isSSO: true,
                email: response.profileObj.email,
                phone: null,
                detail: 'google',
                ssoid: response.googleId,
                extraInfo: {email: response.profileObj.email, name: response.profileObj.name, imageURL: response.profileObj.imageUrl}
            }
            const responseSSO = await axios.put(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/user/sso-signin`, data)
            
            if(responseSSO?.data?.status === "failure"){
                console.log(responseSSO)
                throw new Error(responseSSO.data.msg)
            }
            console.log(responseSSO)
            localStorage.setItem('token', responseSSO.data.token );
            localStorage.setItem('email', response.profileObj.email );
            localStorage.setItem('phone', null );

            navigate('/me')
        }catch(e){
            setOAuthError(e.message)
            console.log(e)
        }
    }

    const onGoogleFailure = (response) => {
        console.log(response);
        setOAuthError('Google SSO Error: Please try Again.')
      }

    const responseFacebook = async(response) => {
        console.log(response)
        try{
 
            const data = {
                isSSO: true,
                phone: null,
                detail: 'facebook',
                ssoid: response.userID,
                extraInfo: {email: response.email, name: response.name, imageURL: response.picture.data.url}
            }
            const responseSSO = await axios.put(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/user/sso-signin`, data)
            
            if(responseSSO?.data?.status === "failure"){
                throw new Error(responseSSO.data.msg)
            }
            console.log("Response :",responseSSO)
            
            // set token received from responseSSO later
            localStorage.setItem('token', responseSSO.data.token );
            localStorage.setItem('email', null );
            localStorage.setItem('email', null );
            localStorage.setItem('name', response.name );
            navigate('/me')


        }catch(e){
            console.log(e)
        }
    }      
      

    return(
        <div >
        
        <div style={{marginLeft: "100px", marginTop: "50px"}} className="tw-bold">Sign Up with SSO: </div>
        <div style={{marginLeft: "70px", }} className = 'd-flex mt-2' >

                {/* <GoogleLogin
                cliend_id="59592262193-i3iun9ssonsts3bb093mdadsqqeaaeak.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            /> */}
        
                <div className="">
                <GoogleLogin
                    clientId= {clientId}
                    buttonText="Login"
                    onSuccess={onGoogleSuccess}
                    onFailure={onGoogleFailure}
                    cookiePolicy={'single_host_origin'}
                    />
                </div>

                <div className="mx-2">
                
                <FacebookLogin
                    appId= {facebookAppId}
                    // autoLoad={true}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    cssClass="btn btn-primary my-facebook-button-class p-2 shadow-sm mb-5 rounded"
                    icon="fa-facebook"
                />
                </div>
        
        </div>

        <div className='text text-danger'>  
            {OAuthError && OAuthError}
        </div>
        </div>
    )

}

export default OAuth;