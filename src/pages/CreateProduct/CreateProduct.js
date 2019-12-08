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
  extractDefaultColorId,
  extractProductIndex,
} from '../../utils/productCreate';
import '../../assets/scss/createProduct.scss';

function CreateProduct() {
  const { doFetch: doProductCreateFetch, } = useFetch();
  const { data: productsList } = useFetch({
    url: URLS.productListGet,
    defaultValue: [],
  });
  const [productCreated, setProductCreated] = useState(false);

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
      stock_status: values.isOutOfStuck ? '0' : '1',
      default_color_id: extractDefaultColorId(values),
      sort_index: extractProductIndex(values, productsList),
      sizes: extractSizesArr(values),
      colors: extractColorsArr(values),
    };

    doProductCreateFetch({
      url: URLS.productCreate,
      params: productObj,
      onSuccess: data => !!data.id && setProductCreated(true)
    });
  };

  return (
    <div className="main">
      {productCreated && <Redirect to="/" />}
      <div className="form-wrapper">
        <CreateProductForm handleFormSubmit={handleFormSubmit} productsList={productsList} />
      </div>
      <div className="brief-wrapper hidden">sdcsa</div>
    </div>
  );
}

export default Form.create({ name: 'loginForm' })(CreateProduct);
