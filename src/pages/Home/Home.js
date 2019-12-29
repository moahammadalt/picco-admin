import React, { useState, useContext, useEffect } from 'react';
import {
  Card,
  Icon,
  Row,
  Col,
  Avatar,
  Modal,
  Select,
  Input,
  Empty,
  Tooltip
} from 'antd';
import { Link } from 'react-router-dom';

import { useFetch, usePrevious } from '../../hooks';
import { LayoutContext, StoreContext } from '../../contexts';
import { URLS } from '../../constants';

import { getParentChildArr } from '../../utils/helpers';
import { baseURL } from '../../utils/API';
import '../../assets/scss/productList.scss';

const { Meta } = Card;
const { Option } = Select;

function Home() {
  const { setHeaderComponent } = useContext(LayoutContext);
  const {
    data: { categories = [] }
  } = useContext(StoreContext);

  const { doFetch: doProductsFetch, data: productListData } = useFetch({
    url: URLS.productListGet,
    defaultValue: [],
    onSuccess: data => {
      setProductList(data);
    }
  });
  const { doFetch: doDeleteFetch } = useFetch();

  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [productList, setProductList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchedValue, setSearchedValue] = useState('');

  const parentCategories = getParentChildArr(categories);

  const prevProductList = usePrevious(productList);
  const prevCategories = usePrevious(categories);

  useEffect(() => {
    const productListChanged =
      JSON.stringify(prevProductList) !== JSON.stringify(productList);
    const categoriesAreReady =
      JSON.stringify(prevCategories) !== JSON.stringify(categories);
    if (productListChanged || categoriesAreReady) {
      setHeaderComponent(getProductsFilter());
    }
  }, [productListData, productList, categories]);

  useEffect(() => {
    return () => {
      setHeaderComponent(null);
    };
  }, []);

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
      method: 'POST',
      onSuccess: data => {
        doProductsFetch({
          url: URLS.productListGet
        });
        setSelectedProductToDelete(null);
      }
    });
  };

  const handleDeletedProductModal = product => {
    setSelectedProductToDelete({ ...product });
  };

  const handleCategoryChange = categoryId => {
    setSelectedCategoryId(categoryId);
    let tmpProductList = categoryId
      ? productListData.filter(product => product.category_id === categoryId)
      : productListData;
    if (searchedValue) {
      tmpProductList = tmpProductList.filter(
        product =>
          product.name.toLowerCase().includes(searchedValue) ||
          product.slug.toLowerCase().includes(searchedValue)
      );
    }
    setProductList(tmpProductList);
  };

  const handleNameSearchChange = e => {
    const filterSearchedValue = e.target.value;
    setSearchedValue(filterSearchedValue);
    let tmpProductList = filterSearchedValue
      ? productListData.filter(
          product =>
            product.name.toLowerCase().includes(filterSearchedValue) ||
            product.slug.toLowerCase().includes(filterSearchedValue)
        )
      : productListData;
    if (selectedCategoryId) {
      tmpProductList = tmpProductList.filter(
        product => product.category_id === selectedCategoryId
      );
    }
    setProductList(tmpProductList);
  };

  function getProductsFilter() {
    return (
      <>
        <div className="filter-item">
          <b>Products count: {productList.length}</b>
        </div>
        <div className="filter-item">
          <b>Category:</b>
          <Select
            value={selectedCategoryId}
            className="filter-select"
            onChange={handleCategoryChange}
          >
            <Option value="">All</Option>
            {parentCategories.map((cat, index) => (
              <Option value={cat.id} key={index}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="filter-item">
          <b>Search by name:</b>
          <Input
            className="filter-by-name"
            onChange={handleNameSearchChange}
            placeholder="product name"
          />
        </div>
      </>
    );
  }

  if (productList.length === 0) {
    return <Empty description="No products found!" />;
  }

  return (
    <Row className="product-list-wrapper" gutter={[30, 30]}>
      {productList.map((product, index) => (
        <Col span={6} key={product.slug}>
          <Card
            cover={getProductFirstImage(product.colors)}
            actions={[
              <Tooltip placement="top" title="Delete">
                <Icon
                  type="delete"
                  key="delete"
                  onClick={() => handleDeletedProductModal(product)}
                />
              </Tooltip>,
              <Tooltip placement="top" title="Update">
                <Link to={`product/${product.slug}`}>
                  <Icon type="edit" key="edit" />
                </Link>
              </Tooltip>,
              <Tooltip placement="top" title="Look">
                <a href={`${baseURL}/${product.slug}`} target="_blank">
                  <Icon type="link" key="link" />
                </a>
              </Tooltip>,
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
