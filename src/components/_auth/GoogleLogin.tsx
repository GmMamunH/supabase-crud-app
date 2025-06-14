import React from 'react'
import { Button } from '../ui/button';
import { ToastContainer } from 'react-toastify';

const GoogleLogin = ({ handleSocialOauth }) => {
  return (
    <div>
      {" "}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSocialOauth("google")}
      >
        Login with Google
      </Button>
      <ToastContainer />
    </div>
  );
};

export default GoogleLogin