import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from "./pages/login";
import Register from "./pages/register";
import Me from './pages/me';
import ForgotPassword from './pages/forgot_password';
import OAuth from './pages/oAuth';
import { gapi } from 'gapi-script';
import HomePage from './pages/homepage';

function App() {

  // gapi.load("client:auth2", () => {
  //   gapi.client.init({
  //     client_id:
  //     "59592262193-i3iun9ssonsts3bb093mdadsqqeaaeak.apps.googleusercontent.com",
  //     plugin_name: "chat",
  //   });
  // });
  
  return (
    <BrowserRouter>
    <Routes>

      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/me" element={<Me />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/oAuth" element={<OAuth />} />
        
        {/* <div className="App">
          <Register />
        </div> */}
    
    </Routes>
    </BrowserRouter>
  );
}

export default App;
