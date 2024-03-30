// AddMedicineForm.js

import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const AddMedicineForm = () => {
  const initialValues = {
    Med_name: '',
    Med_Description: '',
    Unit_price: '',
    Stock_Quant: ''
  };

  const validationSchema = Yup.object({
    Med_name: Yup.string().required('Medicine name is required'),
    Med_Description: Yup.string().required('Medicine description is required'),
    Unit_price: Yup.number().required('Unit price is required').positive('Unit price must be a positive number'),
    Stock_Quant: Yup.number().required('Stock quantity is required').integer('Stock quantity must be an integer').positive('Stock quantity must be a positive number')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post('http://localhost:3001/api/addmedicine', values);
      alert('Medicine added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Error adding medicine. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=''>
              
              <div className="title">
                 <h2>Add Medicine</h2></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {formik => (
          <Form>
            <center>
            <div className="adddoctorform-group">
              <label htmlFor="Med_name"></label>
              <Field type="text" id="Med_name" name="Med_name" className="form-control" placeholder="Medicine name" />
              <ErrorMessage name="Med_name" component="div" className="adddoctorform-error" />
            </div>

            <div className="adddoctorform-group">
              <label htmlFor="Med_Description"></label>
              <Field type="text" id="Med_Description" placeholder="Medicine Description" name="Med_Description" className="form-control" />
              <ErrorMessage name="Med_Description" component="div" className="adddoctorform-error" />
            </div>

            <div className="adddoctorform-group">
              <label htmlFor="Unit_price"></label>
              <Field type="number" id="Unit_price" name="Unit_price" className="form-control" placeholder="Unit Price ($)" />
              <ErrorMessage name="Unit_price" component="div" className="adddoctorform-error" />
            </div>

            <div className="adddoctorform-group">
              <label htmlFor="Stock_Quant"></label>
              <Field type="number" id="Stock_Quant" name="Stock_Quant" className="form-control" placeholder="Stock Quantity"/>
              <ErrorMessage name="Stock_Quant" component="div" className="adddoctorform-error" />
            </div>
</center>
            <button type="submit" className="adddoctorform-submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Adding...' : 'Add Medicine'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMedicineForm;
