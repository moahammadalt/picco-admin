import React, { useState } from 'react';
import { Form } from 'antd';
import { Redirect } from 'react-router-dom';

import CreateUpdateProductForm from '../../components/CreateUpdateProductForm';

import { useFetch } from '../../hooks';
import { URLS } from '../../constants';
import { extractProductObj } from '../../utils/productCreateUpdate';
import '../../assets/scss/createProduct.scss';

function CreateProduct() {
  const { doFetch: doProductCreateFetch, } = useFetch();
  const { data: productsList } = useFetch({
    url: URLS.productListGet,
    defaultValue: [],
  });
  const [productCreated, setProductCreated] = useState(false);

  const handleFormSubmit = values => {

    doProductCreateFetch({
      url: URLS.productCreate,
      params: extractProductObj(),
      onSuccess: data => !!data.id && setProductCreated(true)
    });
  };

  return (
    <div className="main">
      {productCreated && <Redirect to="/" />}
      <div className="form-wrapper">
        <CreateUpdateProductForm handleFormSubmit={handleFormSubmit} productsList={productsList} />
      </div>
      <div className="brief-wrapper hidden">sdcsa</div>
    </div>
  );
}

export default Form.create({ name: 'loginForm' })(CreateProduct);
