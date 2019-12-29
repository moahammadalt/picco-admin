import React, { useState, useContext, useEffect } from 'react';
import { Form } from 'antd';
import { Redirect } from 'react-router-dom';

import CreateUpdateProductForm from '../../components/CreateUpdateProductForm';

import { LayoutContext } from '../../contexts';
import { useFetch } from '../../hooks';
import { URLS } from '../../constants';
import { extractProductObj, validateProduct } from '../../utils/productCreateUpdate';
import '../../assets/scss/createProduct.scss';

function CreateProduct() {
  const { setHeaderComponent } = useContext(LayoutContext);
  const { doFetch: doProductCreateFetch, } = useFetch();
  const { data: productsList } = useFetch({
    url: URLS.productListGet,
    defaultValue: [],
  });
  const [productCreated, setProductCreated] = useState(false);

  const handleFormSubmit = values => {
    const paramsObj = extractProductObj(values, productsList);
    if(!validateProduct(paramsObj)) return;  

    doProductCreateFetch({
      url: URLS.productCreate,
      params: paramsObj,
      onSuccess: data => !!data.id && setProductCreated(true)
    });
  };

  useEffect(() => {
    setHeaderComponent(<b>Create new product</b>);
    return () => {
      setHeaderComponent(null);
    };
  }, []);

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
