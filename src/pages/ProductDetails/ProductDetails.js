import React, { useState, useContext, useEffect } from 'react';
import { Empty } from 'antd';
import { Redirect } from 'react-router-dom';

import CreateUpdateProductForm from '../../components/CreateUpdateProductForm';

import { LayoutContext } from '../../contexts';
import { useFetch } from '../../hooks';
import { extractProductPlace } from '../../utils/productCreateUpdate';
import { baseURL } from '../../utils/API';
import { extractProductObj, validateProduct } from '../../utils/productCreateUpdate';
import { URLS } from '../../constants';

function ProductDetails({ match: { params: { productSlug } } }) {
  const { setHeaderComponent } = useContext(LayoutContext);
  const { data: productData } = useFetch({
    url: URLS.productItemGet({slug: productSlug}),
    defaultValue: { sizes: [], colors: [] },
    onSuccess: (data) => {
      setHeaderComponent(<b>Edit product: <i>{data.name}</i></b>)
    },
    onError: err => {
      setNoProductFoundAlert(true);
    }
  });
  const { data: productsList } = useFetch({
    url: URLS.productListGet,
    defaultValue: [],
  });
  const { doFetch: doProductUpdateFetch, } = useFetch();

  const [noProductFoundAlert, setNoProductFoundAlert] = useState(false);
  const [productUpdated, setProductUpdated] = useState(false);

  useEffect(() => {
    return () => {
      setHeaderComponent(null);
    };
  }, []);

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
    colorFieldsCountArr: productData.colors.length > 0 ? productData.colors.map((color, index) => index) : [0],
  };
  productData.sizes.forEach((size, index) => {
    productObj[`sizeOption${index}`] = size.size_id;
    productObj[`sizeDetail${index}`] = size.size_details;
    productObj[`sizePrice${index}`] = size.size_price;
    productObj[`sizeHeight${index}`] = size.height;
    productObj[`sizeChest${index}`] = size.chest;
    productObj[`sizeWaist${index}`] = size.waistline;
    productObj[`sizeHips${index}`] = size.hips;
    productObj[`sizeRefId${index}`] = size.id;

  });
  productData.colors.forEach((color, index) => {
    productObj[`colorOption${index}`] = color.color_id;
    productObj[`colorCode${index}`] = color.product_color_code;
    productObj[`colorDefault${index}`] = productData.default_color_id === color.color_id;
    productObj[`colorRefId${index}`] = color.id;
    productObj[`colorImages${index}`] = color.images && color.images.map(image => ({
      name: image.image_name,
      thumbUrl: baseURL + image.thumbnail_image_link,
      uid: image.id,
    }));
  });
  productObj['imageListObj'] = productObj.colorFieldsCountArr.reduce((acc, field) => {
    acc[field] =
    productData.colors[field] &&
    productData.colors[field].images.length > 0
        ? productData.colors[field].images.map(image => ({
            name: image.image_name,
            thumbUrl: baseURL + image.thumbnail_image_link,
            uid: image.id
          }))
        : [];
    return acc;
  }, {});

  const handleFormSubmit = (values) => {
    const paramsObj = extractProductObj(values, productsList);
    delete paramsObj.slug;
    paramsObj['id'] = productData.id;
    const sizeRefIds = productData.sizes.map(({ id }) => id);
    const formSizeRefIds = paramsObj.sizes.map(({ refId }) => refId);
    sizeRefIds.forEach(sizeRefId => {
      if(!formSizeRefIds.includes(sizeRefId)) {
        paramsObj.sizes.push({
          id: productData.sizes.find(({ id }) => sizeRefId === id).size_id,
          is_checked: false,
        })
      }
    });
    const colorRefIds = productData.colors.map(({ id }) => id);
    const formColorRefIds = paramsObj.colors.map(({ refId }) => refId);
    colorRefIds.forEach(colorRefId => {
      if(!formColorRefIds.includes(colorRefId)) {
        paramsObj.colors.push({
          id: productData.colors.find(({ id }) => colorRefId === id).color_id,
          is_checked: false,
        })
      }
    });

    if(!validateProduct(paramsObj)) return; 
    
    doProductUpdateFetch({
      url: URLS.productUpdate({ slug: productData.slug}),
      params: paramsObj,
      showSuccessNotification: true,
      onSuccess: data => !!data.id && setProductUpdated(true)
    });
  }

  if(productUpdated) {
    return <Redirect to="/" />;
  }

  if(noProductFoundAlert) {
    return <Empty description="No product found!"/> 
  }

  return (
    <CreateUpdateProductForm handleFormSubmit={handleFormSubmit} productsList={productsList} productObj={productObj} />
  );
  
}

export default ProductDetails;
