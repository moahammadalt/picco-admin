import React, { useState } from 'react';
import { Empty } from 'antd';

import { useFetch } from '../../hooks';
import { URLS } from '../../constants';
import CreateProductForm from '../CreateProduct/CreateProductForm';
import { extractProductPlace } from '../../utils/productCreate';

function ProductDetails({ match: { params: { productSlug } } }) {
  const { data: productData } = useFetch({
    url: URLS.productItemGet({slug: productSlug}),
    defaultValue: { sizes: [], colors: [] },
    onError: err => {
      setNoProductFoundAlert(true);
    }
  });
  const { data: productsList } = useFetch({
    url: URLS.productListGet,
    defaultValue: [],
  });

  const [noProductFoundAlert, setNoProductFoundAlert] = useState(false);

  const productObj = {
    name: productData.name,
    category: productData.category_id,
    type: productData.category_type_id,
    tag: productData.category_tag_id,
    description: productData.description,
    details: productData.details,
    mainPrice: productData.price,
    isBest: !!productData.is_best,
    isHandmade: !!productData.is_handmade,
    isOutOfStuck: !!!productData.stock_status,
    sortPlace: extractProductPlace(productData.sort_index, productsList),
    sizeFieldsCountArr: productData.sizes.length > 0 ? productData.sizes.map((size, index) => index) : [0],
  };
  productData.sizes.forEach((size, index) => {
    productObj[`sizeOption${index}`] = size.size_id;
    productObj[`sizeDetail${index}`] = size.size_details;
    productObj[`sizePrice${index}`] = size.size_price;
    productObj[`sizeHeight${index}`] = size.height;
    productObj[`sizeChest${index}`] = size.chest;
    productObj[`sizeWaist${index}`] = size.waistline;
    productObj[`sizeHips${index}`] = size.hips;
  })
  console.log('productData', productData);

  const handleFormSubmit = (values) => {
    console.log('values: ', values);
  }

  if(noProductFoundAlert) {
    return <Empty description="No product found!"/> 
  }
  return (
    <CreateProductForm handleFormSubmit={handleFormSubmit} productsList={productsList} productObj={productObj} />
  );
  
}

export default ProductDetails;
