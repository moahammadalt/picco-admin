import React, { useState, useEffect } from 'react';
import { Card, Icon, Row, Col, Avatar, Modal } from 'antd';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';

import { baseURL } from '../../utils/API';
import '../../assets/scss/productList.scss';

const { Meta } = Card;

function Home() {
  const { doFetch: doProductsFetch, data: productListData } = useFetch({
    url: URLS.productListGet
  });
  const { doFetch: doDeleteFetch, data: deleteResponse } = useFetch();
  const prevDeleteResponse = usePrevious(deleteResponse) || {};

  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);

  useEffect(() => {
    if (JSON.stringify(deleteResponse) !== JSON.stringify(prevDeleteResponse)) {
      doProductsFetch({
        url: URLS.productListGet
      });
      setSelectedProductToDelete(null);
    }
  }, [deleteResponse]);

  const getProductFirstImage = colors => {
    if (
      colors.length === 0 ||
      !colors[0].images ||
      colors[0].images.length === 0 ||
      !colors[0].images[0].image_name
    )
      return (
        <Avatar
          shape="square"
          size={140}
          icon={<Icon type="smile" theme="outlined" />}
          className="avatar-image"
        />
      );

    return (
      <img
        alt="example"
        className="product-first-image"
        src={`${baseURL}${colors[0].images[0].small_image_link}`}
      />
    );
  };

  const handleProductDelete = () => {
    doDeleteFetch({
      url: URLS.productDelete({ slug: selectedProductToDelete.slug }),
      method: 'POST'
    });
  };

  const handleDeletedProductModal = product => {
    setSelectedProductToDelete({ ...product });
  };

  return (
    <Row className="product-list-wrapper" gutter={[30, 30]}>
      {productListData instanceof Array &&
        productListData.map((product, index) => (
          <Col span={6} key={product.slug}>
            <Card
              cover={getProductFirstImage(product.colors)}
              actions={[
                <Icon
                  type="delete"
                  key="delete"
                  onClick={() => handleDeletedProductModal(product)}
                />,
                <a href={`${baseURL}/${product.slug}`} target="_blank">
                  <Icon type="link" key="link" />
                </a>,
                <Icon type="edit" key="edit" />
              ]}
            >
              <Meta
                title={product.name}
                description={`${product.category_slug} ${
                  product.category_type_slug
                    ? `-${product.category_type_slug}`
                    : ''
                }`}
              />
            </Card>
          </Col>
        ))}

      <Modal
        title={`Delete product: ${selectedProductToDelete &&
          selectedProductToDelete.name}`}
        visible={!!selectedProductToDelete}
        onOk={handleProductDelete}
        onCancel={() => setSelectedProductToDelete(null)}
      >
        Do you confirm deleteing the product?
      </Modal>
    </Row>
  );
}

export default Home;
