// AddDoctorForm.js
import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './adddoctor.css';

const AddDoctorForm = () => {
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    docName: Yup.string().required('Doctor name is required'),
    docAge: Yup.number().required('Age is required').positive('Age must be a positive number'),
    docQualification: Yup.string().required('Qualification is required'),
    docDept: Yup.string()
      .required('Department is required')
      .test('capitalize-first-letter', 'Department must start with a capital letter and be lowercase', value => /^[A-Z][a-z]*$/.test(value)),
    docExperience: Yup.number().required('Experience is required').positive('Experience must be a positive number'),
    docContact: Yup.string().required('Contact number is required'),
    docSpecification: Yup.string().required('Specification is required')
  });
  

  const formik = useFormik({
    initialValues: {
      docName: '',
      docAge: '',
      docQualification: '',
      docDept: '',
      docExperience: '',
      docContact: '',
      docSpecification: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3001/api/adddoctors', values);
        alert('Doctor added successfully');
        // Reset form fields after successful submission
        formik.resetForm();
      } catch (error) {
        console.error('Error adding doctor:', error);
        setError('Error adding doctor. Please try again.');
      }
    }
  });

  return (
    <div className="">
      <div className="title">
      <h2>Add Doctor</h2></div>
      <form onSubmit={formik.handleSubmit}>
        <center>
        <div className="adddoctorform-group">
          <input type="text" id="docName" name="docName" placeholder="Doctor Name" value={formik.values.docName} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docName && formik.errors.docName ? <div className="adddoctorform-error">{formik.errors.docName}</div> : null}
        </div>
        
        <div className="adddoctorform-group">
          <input type="number" id="docAge" name="docAge" placeholder="Doctor Age" value={formik.values.docAge} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docAge && formik.errors.docAge ? <div className="adddoctorform-error">{formik.errors.docAge}</div> : null}
        </div>
        
        <div className="adddoctorform-group">
          <input type="text" id="docQualification" name="docQualification" placeholder="Qualification" value={formik.values.docQualification} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docQualification && formik.errors.docQualification ? <div className="adddoctorform-error">{formik.errors.docQualification}</div> : null}
        </div>
        
        <div className="adddoctorform-group">
          <input type="text" id="docDept" name="docDept" placeholder="Department" value={formik.values.docDept} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docDept && formik.errors.docDept ? <div className="adddoctorform-error">{formik.errors.docDept}</div> : null}
        </div>
        
        <div className="adddoctorform-group">
          <input type="number" id="docExperience" name="docExperience" placeholder="Experience" value={formik.values.docExperience} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docExperience && formik.errors.docExperience ? <div className="adddoctorform-error">{formik.errors.docExperience}</div> : null}
        </div>
        
        <div className="adddoctorform-group">
          <input type="text" id="docContact" name="docContact" placeholder="Contact Number" value={formik.values.docContact} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docContact && formik.errors.docContact ? <div className="adddoctorform-error">{formik.errors.docContact}</div> : null}
        </div>
        
        <div className="adddoctorform-group">
          <input type="text" id="docSpecification" name="docSpecification" placeholder="Specification" value={formik.values.docSpecification} onChange={formik.handleChange} className="adddoctorform-input" />
          {formik.touched.docSpecification && formik.errors.docSpecification ? <div className="adddoctorform-error">{formik.errors.docSpecification}</div> : null}
        </div>
        </center>
        
        <button type="submit" className="adddoctorform-submit">Add Doctor</button>
      </form>
      {error && <div className="adddoctorform-error">{error}</div>}
      
    </div>
  );
};

export default AddDoctorForm;
