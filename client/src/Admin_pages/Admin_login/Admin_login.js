// Admin_Login.js

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as Yup from 'yup'; // Import Yup for schema validation
import './Admin_login.css';

const Admin_login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectTo, setRedirectTo] = useState(false);

  // Define Yup schema for form validation
  const schema = Yup.object().shape({
    username: Yup.string().required('Username is required').matches(/^admin$/, 'Invalid username'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async () => {
    try {
      await schema.validate({ username, password }, { abortEarly: false });
      if (username === 'admin' && password === 'admin123') {
        setRedirectTo(true);
      } else {
        setError('Invalid username or password');
      }
    } catch (validationError) {
      // Handle Yup validation errors
      setError(validationError.errors[0]);
    }
  };

  if (redirectTo) {
    return <Navigate to="/adminhome" />;
  }
  

  return (
    <div className="landing-page">
    <div className="left-side">
    </div>
    <div className="right-side">
        <div className="admin-login-form">
      <div className="title">
      <h1 className="login-form-header">Admin Login</h1>
      </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
    </div>
  );
};

export default Admin_login;
