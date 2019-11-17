import React, { useContext } from 'react';
import { Form } from 'antd';

import CreateProductForm from './CreateProductForm';

import { StoreContext } from '../../contexts';
import '../../assets/scss/createProduct.scss';

function CreateProduct({ form }) {

  const { data } = useContext(StoreContext);

  const handleFormSubmit = values => {
    console.log('values: ', values);
  };
  
  return (
    <div className="main">
      <div className="form-wrapper">
        <CreateProductForm handleFormSubmit={handleFormSubmit}/>
      </div>
      <div className="brief-wrapper">
        sdcsa
      </div>
    </div>
  );
}

export default Form.create({ name: 'loginForm' })(CreateProduct);
