import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { Redirect } from 'react-router-dom';

import CreateProductForm from './CreateProductForm';

import { useFetch } from '../../hooks';
import { URLS } from '../../constants';
import {
  extractSlug,
  extractSizesArr,
  extractColorsArr,
  extractDefaultColorId
} from '../../utils/productCreate';
import '../../assets/scss/createProduct.scss';

function CreateProduct() {
  const { doFetch: doProductCreateFetch, data: productCreateData } = useFetch();
  const [productCreated, setProductCreated] = useState(false);

  useEffect(() => {
    if(!!productCreateData.id) {
      setProductCreated(true);
    }

  }, [productCreateData]);

  const handleFormSubmit = values => {

    const productObj = {
      name: values.name,
      slug: extractSlug(values.name),
      category_id: values.category,
      category_type_id: values.type,
      description: values.description,
      details: values.details,
      price: values.mainPrice,
      currency: 'EUR',
      is_best: values.isBest ? '1' : '0',
      is_handmade: values.isHandmade ? '1' : '0',
      default_color_id: extractDefaultColorId(values),
      sizes: extractSizesArr(values),
      colors: extractColorsArr(values)
    };

    doProductCreateFetch({
      url: URLS.productCreate,
      params: productObj,
    });
  };

  return (
    <div className="main">
      {productCreated && <Redirect to="/" />}
      <div className="form-wrapper">
        <CreateProductForm handleFormSubmit={handleFormSubmit} />
      </div>
      <div className="brief-wrapper hidden">sdcsa</div>
    </div>
  );
}

export default Form.create({ name: 'loginForm' })(CreateProduct);
