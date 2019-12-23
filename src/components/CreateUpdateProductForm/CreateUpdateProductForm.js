import React, { useContext, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  notification,
  Upload,
  Icon,
  Divider,
  Switch
} from 'antd';

import RichInput from '../RichInput';

import { getParentChildArr } from '../../utils/helpers';
import { StoreContext } from '../../contexts';
import { URLS, FIRST_INDEX, LAST_INDEX } from '../../constants';
import { useFetch, usePrevious } from '../../hooks';
import { baseURL } from '../../utils/API';
import '../../assets/scss/CreateUpdateProductForm.scss';

const { Title } = Typography;
const { Option } = Select;

function CreateUpdateProductForm({
  form,
  handleFormSubmit,
  productsList = [],
  productObj = {}
}) {
  const {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    getFieldValue,
    getFieldsValue
  } = form;
  const {
    data: { categories = [], sizes = [], colors = [] }
  } = useContext(StoreContext);
  const parentCategories = getParentChildArr(categories);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [sizeFieldsCountArr, setSizeFieldsCountArr] = useState([0]);
  const [colorFieldsCountArr, setColorFieldsCountArr] = useState([0]);
  const [imagesListObj, setImagesListObj] = useState({ 0: [] });

  const { doFetch: doImageUpload } = useFetch();
  const prevProductObj = usePrevious(productObj);
  const prevParentCategories = usePrevious(parentCategories);

  useEffect(() => {
    const productObjIsReady =
      JSON.stringify(prevProductObj) !== JSON.stringify(productObj);
    const categoriesAreReady =
      JSON.stringify(prevParentCategories) !== JSON.stringify(parentCategories);
    if (productObjIsReady || categoriesAreReady) {
      !!productObj.category && onCategoryChanged(productObj.category);
      !!productObj.type && onCategoryTypeChanged(productObj.type);
      !!productObj.type && setFieldsValue({ type: productObj.type });
      !!productObj.sizeFieldsCountArr &&
        setSizeFieldsCountArr(productObj.sizeFieldsCountArr);
      !!productObj.colorFieldsCountArr &&
        setColorFieldsCountArr(productObj.colorFieldsCountArr);
      !!productObj.imageListObj && setImagesListObj(productObj.imageListObj);
    }
  }, [productObj, parentCategories]);

  const handleSubmit = async e => {
    e.preventDefault();
    const values = await validateFields();
    handleFormSubmit(values);
  };

  const onCategoryChanged = value => {
    const selectedIndex = parentCategories.findIndex(({ id }) => value == id);
    setCategoryTypes(
      parentCategories[selectedIndex]
        ? parentCategories[selectedIndex].children
        : []
    );
    setFieldsValue({
      type: undefined
    });
  };

  const onCategoryTypeChanged = value => {
    const selectedIndex = categoryTypes.findIndex(({ id }) => value == id);
    setCategoryTags(
      categoryTypes[selectedIndex] ? categoryTypes[selectedIndex].children : []
    );
    setFieldsValue({
      tag: undefined
    });
  };

  const setDescription = value => {
    setFieldsValue({
      description: value
    });
  };

  const setDetails = value => {
    setFieldsValue({
      details: value
    });
  };

  const showWarningNotification = msg => {
    notification.warning({
      placement: 'bottomRight',
      message: 'An error occured!',
      duration: 4,
      description: msg
    });
  };

  const addNewSizeFields = prevIndex => {
    const hasPrevSize = !!getFieldValue('sizeOption' + prevIndex);
    if (!hasPrevSize) {
      showWarningNotification('please enter the size before adding a new one.');
    } else {
      const tmpArr = [...sizeFieldsCountArr];
      tmpArr.push(tmpArr[tmpArr.length - 1] + 1);
      setSizeFieldsCountArr(tmpArr);
    }
  };

  const removeSizeFields = (index, fieldIndex) => {
    const tmpArr = [...sizeFieldsCountArr];
    tmpArr.splice(index, 1);
    setSizeFieldsCountArr(tmpArr);
  };

  const addNewColorFields = prevIndex => {
    const hasPrevColor = !!getFieldValue('colorOption' + prevIndex);
    if (!hasPrevColor) {
      showWarningNotification(
        'please enter the color before adding a new one.'
      );
    } else {
      const tmpArr = [...colorFieldsCountArr];
      const lastFiledValue = tmpArr[tmpArr.length - 1];
      tmpArr.push(lastFiledValue + 1);
      setColorFieldsCountArr(tmpArr);
      setImagesListObj({
        ...imagesListObj,
        [lastFiledValue + 1]: []
      });
    }
  };

  const removeColorFields = (index, fieldIndex) => {
    const tmpArr = [...colorFieldsCountArr];
    tmpArr.splice(index, 1);
    setColorFieldsCountArr(tmpArr);

    const tmpImagesListObj = imagesListObj;
    delete tmpImagesListObj[fieldIndex];
    setImagesListObj(tmpImagesListObj);
  };

  const uploadImage = (file, fieldIndex) => {
    doImageUpload({
      method: 'FILE_POST',
      params: { product_image: file },
      url: URLS.imageUpload,
      showSuccessNotification: true,
      successMessage: 'Image uploaded successfully.',
      onSuccess: imageResponse => {
        let imagesListObjTmp = { ...imagesListObj };

        imagesListObjTmp[fieldIndex].push({
          uid: imageResponse.image_name,
          thumbUrl: baseURL + imageResponse.image_link,
          name: imageResponse.image_name
        });
        setImagesListObj(imagesListObjTmp);
        setFieldsValue({
          [`colorImages${fieldIndex}`]: imagesListObjTmp[fieldIndex]
        });
      }
    });
  };

  const handleImageUploadRemove = (fileData, fileIndex) => {
    const tmpImagesListObj = { ...imagesListObj };
    const findSelectedImageIndex = imagesListObj[fileIndex].findIndex(
      ({ uid }) => fileData.uid === uid
    );
    tmpImagesListObj[fileIndex].splice(findSelectedImageIndex, 1);
    setImagesListObj(tmpImagesListObj);
  };

  const handleDefaultColorChange = (value, fieldIndex) => {
    Object.keys(getFieldsValue()).forEach(fieldName => {
      if (
        fieldName.startsWith('colorDefault') &&
        fieldIndex != fieldName[fieldName.length - 1]
      ) {
        setFieldsValue({
          [fieldName]: false
        });
      }
    });
  };
  //console.log('imagesListObj', imagesListObj, colorFieldsCountArr);

  return (
    <Row>
      <Form onSubmit={handleSubmit} className="form-wrapper">
        <Row>
          <Col span={12}>
            <Form.Item label="Name:">
              {getFieldDecorator('name', {
                initialValue: productObj.name,
                rules: [
                  { required: true, message: 'Please enter product name!' }
                ]
              })(<Input placeholder="product name" size="large" />)}
            </Form.Item>
          </Col>
          <Col span={12} />
        </Row>
        <Divider />
        <Row gutter={[20, 0]}>
          <Col span={8}>
            <Form.Item label="Category">
              {getFieldDecorator('category', {
                initialValue: productObj.category,
                rules: [
                  { required: true, message: 'Please select the category!' }
                ]
              })(
                <Select
                  placeholder="Select a category"
                  onChange={onCategoryChanged}
                >
                  {parentCategories.map((cat, index) => (
                    <Option value={cat.id} key={index}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            {categoryTypes.length > 0 && (
              <Form.Item label="Type">
                {getFieldDecorator('type', {
                  initialValue: productObj.type,
                  rules: [
                    { required: true, message: 'Please select the type!' }
                  ]
                })(
                  <Select
                    placeholder="Select a type"
                    onChange={onCategoryTypeChanged}
                  >
                    {categoryTypes.map((cat, index) => (
                      <Option value={cat.id} key={index}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            {categoryTags.length > 0 && (
              <Form.Item label="Tag">
                {getFieldDecorator('tag', { initialValue: productObj.tag })(
                  <Select placeholder="Select a tag">
                    {categoryTags.map((cat, index) => (
                      <Option value={cat.id} key={index}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              initialValue: productObj.description
            })(
              <RichInput
                placeholder="Description"
                initialValue={productObj.description}
                onChangeHandler={setDescription}
              />
            )}
          </Form.Item>
        </Row>
        <Divider />
        <Row>
          <Form.Item label="Details">
            {getFieldDecorator('details', { initialValue: productObj.details })(
              <RichInput
                placeholder="Details"
                onChangeHandler={setDetails}
                initialValue={productObj.description}
              />
            )}
          </Form.Item>
        </Row>
        <Divider />
        <Row>
          <Form.Item label="Main Price" className="price-input">
            {getFieldDecorator('mainPrice', {
              initialValue: productObj.mainPrice
            })(<Input size="large" />)}
          </Form.Item>
        </Row>
        <Divider />
        <Row>
          <Form.Item label="Is Best Product:">
            {getFieldDecorator('isBest', { initialValue: productObj.isBest })(
              <Switch checked={getFieldValue('isBest')} />
            )}
          </Form.Item>
        </Row>
        <Divider />
        <Row>
          <Form.Item label="Is Handmade Product:">
            {getFieldDecorator('isHandmade', {
              initialValue: productObj.isHandmade
            })(<Switch checked={getFieldValue('isHandmade')} />)}
          </Form.Item>
        </Row>
        <Divider />
        <Row>
          <Form.Item label="Is Product Out Of Stock:">
            {getFieldDecorator('isOutOfStuck', {
              initialValue: productObj.isOutOfStuck
            })(<Switch checked={getFieldValue('isOutOfStuck')} />)}
          </Form.Item>
        </Row>
        <Divider />
        <Row>
          <Col span={8}>
            <Form.Item label="Product Place:">
              {getFieldDecorator('sortPlace', {
                initialValue: productObj.sortPlace || LAST_INDEX
              })(
                <Select
                  showSearch
                  placeholder="Select a product"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    const str = Array.isArray(option.props.children)
                      ? option.props.children.join('')
                      : option.props.children;
                    return str.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  <Option value={FIRST_INDEX} style={{ color: '#7bb3b3' }}>
                    At First
                  </Option>
                  <Option value={LAST_INDEX} style={{ color: '#7bb3b3' }}>
                    At Last
                  </Option>
                  {productsList.map(
                    ({ id, name }) =>
                      productObj.name !== name && (
                        <Option key={id} value={id}>
                          Before: {name}
                        </Option>
                      )
                  )}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Row>
            <Title level={4}>Sizes</Title>
          </Row>
          {sizeFieldsCountArr.map((fieldIndex, i) => (
            <div key={i}>
              <Form.Item className="hidden">
                {getFieldDecorator(`sizeRefId${fieldIndex}`, {
                  initialValue: productObj[`sizeRefId${fieldIndex}`],
                })(
                  <Input />
                )}
              </Form.Item>
              <Row gutter={[5, 0]} key={fieldIndex}>
                <Col span={3}>
                  <Form.Item label="Size:">
                    {getFieldDecorator(`sizeOption${fieldIndex}`, {
                      initialValue: productObj[`sizeOption${fieldIndex}`]
                    })(
                      <Select placeholder="Select a size">
                        {sizes.map((size, index) => (
                          <Option value={size.id} key={index}>
                            {size.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Size detail:">
                    {getFieldDecorator(`sizeDetail${fieldIndex}`, {
                      initialValue: productObj[`sizeDetail${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Size Price:">
                    {getFieldDecorator(`sizePrice${fieldIndex}`, {
                      initialValue: productObj[`sizePrice${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Height:">
                    {getFieldDecorator(`sizeHeight${fieldIndex}`, {
                      initialValue: productObj[`sizeHeight${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Chest:">
                    {getFieldDecorator(`sizeChest${fieldIndex}`, {
                      initialValue: productObj[`sizeChest${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Waist:">
                    {getFieldDecorator(`sizeWaist${fieldIndex}`, {
                      initialValue: productObj[`sizeWaist${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item label="Hips:">
                    {getFieldDecorator(`sizeHips${fieldIndex}`, {
                      initialValue: productObj[`sizeHips${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  {sizeFieldsCountArr.length !== 1 && (
                    <Button
                      className="m-t-43 m-r-5"
                      type="dashed"
                      icon="minus"
                      onClick={() => removeSizeFields(i, fieldIndex)}
                    />
                  )}
                  {i === sizeFieldsCountArr.length - 1 && (
                    <Button
                      className="m-t-43"
                      type="dashed"
                      icon="plus"
                      onClick={() => addNewSizeFields(fieldIndex)}
                    />
                  )}
                </Col>
                <Col span={3}></Col>
              </Row>
              {sizeFieldsCountArr.length !== 1 &&
                i !== sizeFieldsCountArr.length - 1 && <Divider dashed />}
            </div>
          ))}
        </Row>
        <Divider />
        <Row>
          <Row>
            <Title level={4}>Colors & Images</Title>
          </Row>
          {colorFieldsCountArr.map((fieldIndex, i) => (
            <div key={i}>
              <Form.Item className="hidden">
                {getFieldDecorator(`colorRefId${fieldIndex}`, {
                  initialValue: productObj[`colorRefId${fieldIndex}`],
                })(
                  <Input />
                )}
              </Form.Item>
              <Row gutter={[10, 0]} key={fieldIndex}>
                <Col span={4}>
                  <Form.Item label={`Color: ${fieldIndex} index: ${i}`}>
                    {getFieldDecorator(`colorOption${fieldIndex}`, {
                      initialValue: productObj[`colorOption${fieldIndex}`]
                    })(
                      <Select placeholder="Select a color">
                        {colors.map((color, index) => (
                          <Option value={color.id} key={index}>
                            {color.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Color code:">
                    {getFieldDecorator(`colorCode${fieldIndex}`, {
                      initialValue: productObj[`colorCode${fieldIndex}`]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Color Images:"
                    className="product-image-upload"
                  >
                    {getFieldDecorator(`colorImages${fieldIndex}`, {
                      initialValue: productObj[`colorImages${fieldIndex}`]
                    })(
                      <Upload
                        listType="picture-card"
                        fileList={imagesListObj[fieldIndex]}
                        customRequest={({ file }) =>
                          uploadImage(file, fieldIndex)
                        }
                        onRemove={file =>
                          handleImageUploadRemove(file, fieldIndex)
                        }
                      >
                        {imagesListObj[fieldIndex] &&
                        imagesListObj[fieldIndex].length >= 8 ? null : (
                          <>
                            <Icon type="plus" />
                            <div className="ant-upload-text">Upload</div>
                          </>
                        )}
                      </Upload>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Set Default Color:">
                    {getFieldDecorator(`colorDefault${fieldIndex}`, {
                      initialValue: productObj[`colorDefault${fieldIndex}`]
                    })(
                      <Switch
                        checked={getFieldValue(`colorDefault${fieldIndex}`)}
                        onChange={value =>
                          handleDefaultColorChange(value, fieldIndex)
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  {colorFieldsCountArr.length !== 1 && (
                    <Button
                      className="m-t-43 m-r-5"
                      type="dashed"
                      icon="minus"
                      onClick={() => removeColorFields(i, fieldIndex)}
                    />
                  )}
                  {i === colorFieldsCountArr.length - 1 && (
                    <Button
                      className="m-t-43"
                      type="dashed"
                      icon="plus"
                      onClick={() => addNewColorFields(fieldIndex)}
                    />
                  )}
                </Col>
              </Row>
              {colorFieldsCountArr.length !== 1 &&
                i !== colorFieldsCountArr.length - 1 && <Divider dashed />}
            </div>
          ))}
        </Row>
        {/* <Row>
        <Form.Item>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please enter product description!' }]
          })(
            <Input
              placeholder="product description"
              size="large"
            />
          )}
        </Form.Item>
      </Row> */}
        <Row className="m-t-30">
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Save
            </Button>
          </Form.Item>
        </Row>
      </Form>
      {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
    </Row>
  );
}

export default Form.create({ name: 'loginForm' })(CreateUpdateProductForm);
