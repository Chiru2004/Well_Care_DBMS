import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import './login.css'; // Your CSS file for styling
import {useNavigate} from 'react-router-dom';
const LoginForm = () => {
  const [formData, setFormData] = useState({
    patientEmail: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  axios.defaults.withCredentials=true;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = Yup.object().shape({
      patientEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        ,
    });

    try {
      await schema.validate(formData, { abortEarly: false });
      // If validation passes, submit form data
      const response = await axios.post('http://localhost:3001/api/login',formData );

      if (response.status === 200) {
        console.log(response.data.message); // Login successful
        // Redirect to home page or perform any other action upon successful login
        navigate('/home');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle specific error messages
        setLoginError(error.response.data.message);
      } else if (error.name === 'ValidationError') {
        // Handle Yup validation errors
        const validationErrors = {};
        error.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle other errors
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <h1 className="login-form-header">Login to Your Account</h1>
        <form onSubmit={handleSubmit} className='form-elements'>
          <div className="form-group">
            <input
              type="email"
              id="patientEmail"
              name="patientEmail"
              placeholder="Email"
              className="form-control"
              onChange={handleChange}
              value={formData.patientEmail}
            />
            {errors.patientEmail && <div className="error">{errors.patientEmail}</div>}
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="form-control"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          {loginError && <div className="error">{loginError}</div>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
