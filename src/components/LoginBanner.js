import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import bannerLogo from '../images/SPPbanner2.png';
import GoogleLogin from 'react-google-login';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginBanner = ({authenticatedRole, googleAuthCallback, logoutCallback}) => {

  const [uuid, setUuid] = useState("");

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  ////////////////////// LOGIN //////////////////////
  const responseGoogle = (response) => {
    // send info up to App.js     
    googleAuthCallback(response.profileObj.googleId);
  }

  const showGoogleLogin = () => {
    return (
      <section className="btn btn-google">
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </section>
    );
  }
  
  const updateUuid = (e) => {
    setUuid(e.target.value);
  }

  const sendUuidApi = (e) => {
    e.preventDefault();
    handleCloseModal();
    console.log("SEND API WITH uuid =", uuid);
    console.log(sessionStorage.getItem('googleId'));

    const URL_endpoint = `${process.env.REACT_APP_LOGIN}/${sessionStorage.getItem('googleId')}`;

    axios.post(URL_endpoint, {uuid: uuid})
    .then(response => console.log(response.data))
    .catch(error => toast.error(error.message));



    
  }

  ////////////////////// DASHBOARD BUTTONS //////////////////////
  const showDashWithLogout = () => {
    const name = sessionStorage.getItem("username");

    if (authenticatedRole === "ADMIN") {
      return (
        <section className="dashboard-buttons_container">
          <button className="btn btn-success dashboard-buttons"><Link to="/adminDash">{name}'s Dashboard</Link></button>
          <button className="btn btn-danger dashboard-buttons" onClick={logoutCallback}><Link to="/">LOGOUT</Link></button>
        </section>
      );
    } else if (authenticatedRole === "EMPLOYEE") {
      return (
        <section className="dashboard-buttons_container">
          <button className="btn btn-success dashboard-buttons"><Link to="/employeeDash">{name}'s Dashboard</Link></button>
          <button className="btn btn-danger dashboard-buttons" onClick={logoutCallback}><Link to="/">LOGOUT</Link></button>
        </section>
      );
    } else {
      return (
        <section className="dashboard-buttons_container">
          <button className="btn btn-warning dashboard-buttons" onClick={handleShowModal}>First time logging in?  Click to activate account!</button>
          <button className="btn btn-danger dashboard-buttons" onClick={logoutCallback}><Link to="/">LOGOUT</Link></button>
        </section>
      );
    }
  }


////////////////////// RENDER //////////////////////
  return(
    <section>
      <section className="loginBanner-section text-centered">
        <Link to="/"><img src={bannerLogo} alt="sppBannerLogo" className="img-90"/></Link>
        {authenticatedRole? showDashWithLogout():showGoogleLogin()}
      </section>


      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Schedule Plus Plus!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Please copy and paste your unique verification id, including the dashes.
          <form>
            <input type="text" className="form-control margin-top-1rem" onChange={updateUuid} placeholder={"Example: 12345678-abcd-abcd-abcd-1234abcd1234"}/>
            <section className="centered-children-per-row_container">
              <button className="btn btn-primary margin-top-1rem" onClick={sendUuidApi}>Log in!</button>
            </section>
          </form>
        </Modal.Body>
      </Modal>
    </section>
  );
  
    
}

export default LoginBanner;
