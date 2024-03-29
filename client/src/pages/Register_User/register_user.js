import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import './register_user.css';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    bloodgroup: '',
    phoneNumber: '',
    gender: '',
    aadharNo: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data with Yup
      const schema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        age: Yup.number().required('Age is required').positive('Age must be a positive number'),
        bloodgroup: Yup.string().required('Blood Group is required'),
        phoneNumber: Yup.string().required('Phone Number is required').matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits'),
        gender: Yup.string().required('Gender is required').oneOf(['male', 'female'], 'Gender must be either "male" or "female"'),
        aadharNo: Yup.string().required('Aadhar Number is required').matches(/^[0-9]{12}$/, 'Aadhar Number must be 12 digits'),
        address: Yup.string().required('Address is required'),
      });

      await schema.validate(formData, { abortEarly: false });

      // If validation passes, submit form data
      const response = await axios.post(' http://localhost:3001/api/register', formData);

      if (response.status === 201) {
        setRegistrationSuccess(true);
        navigate('/login');

      } else {
        console.error('Failed to register');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }

      if (error.name === 'ValidationError') {
        // Update errors state with Yup validation errors
        const yupErrors = {};
        error.inner.forEach((e) => {
          yupErrors[e.path] = e.message;
        });
        setErrors(yupErrors);
      } else {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="landing-page">
    <div className="left-side">
    
    </div>
    <div className="right-side">
      <h1 className="title">Register Yourself..!</h1>
      {registrationSuccess && <p className="success-message">Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            placeholder='Enter username'
            id="username"
            name="username"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.username}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div className="form-group">
          <input
            placeholder='Enter email'
            id="email"
            name="email"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && <div className="error">{errors.email}</div>}
          {errorMessage.includes("Email") && <div className="error">{errorMessage}</div>}
        </div>

        <div className="form-group">
          <input
            placeholder='Enter password'
            id="password"
            name="password"
            type="password"
            className="input"
            onChange={handleChange}
            value={formData.password}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <input
            placeholder='Enter age'
            id="age"
            name="age"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.age}
          />
          {errors.age && <div className="error">{errors.age}</div>}
        </div>
        <div className="form-group">
          <input
            placeholder='Enter phone number'
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
        </div>
        <div className="form-group">
          <input
            placeholder='Enter blood group'
            id="bloodgroup"
            name="bloodgroup"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.bloodgroup}
          />
          {errors.bloodgroup && <div className="error">{errors.bloodgroup}</div>}
        </div>

        <div className="form-group">
          <input
            placeholder='Enter gender (male/female)'
            id="gender"
            name="gender"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.gender}
          />
          {errors.gender && <div className="error">{errors.gender}</div>}
        </div>

        <div className="form-group">
          <input
            placeholder='Enter Aadhar number'
            id="aadharNo"
            name="aadharNo"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.aadharNo}
          />
          {errors.aadharNo && <div className="error">{errors.aadharNo}</div>}
        </div>

        <div className="form-group">
          <input
            placeholder='Enter address'
            id="address"
            name="address"
            type="text"
            className="input"
            onChange={handleChange}
            value={formData.address}
          />
          {errors.address && <div className="error">{errors.address}</div>}
        </div>

        <button type="submit" className="btn">Register</button>
      </form>
      </div>
    </div>
  );
};

export default RegisterForm;
