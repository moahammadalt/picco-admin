import React, { useContext, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  Typography
} from 'antd';

import RichInput from '../../components/RichInput';

import { getParentChildArr } from '../../utils/helpers';
import { StoreContext } from '../../contexts';
import '../../assets/scss/createProductForm.scss';

const { Title } = Typography;

function CreateProduct({ form, handleFormSubmit }) {
  const {
    data, data: { categories = [], sizes = [], colors = [] }
  } = useContext(StoreContext);
  const parentCategories = getParentChildArr(categories);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);
  const [sizeFieldsArr, setSizeFieldArr] = useState([null]);

  const { Option } = Select;
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = async e => {
    e.preventDefault();
    const values = await validateFields();
    handleFormSubmit(values);
  };

  const onCategoryChanged = value => {
    const selectedIndex = parentCategories.findIndex(({ id }) => value === id);
    setCategoryTypes(parentCategories[selectedIndex].children);
    form.setFieldsValue({
      type: undefined
    });
  };

  const onCategoryTypeChanged = value => {
    const selectedIndex = categoryTypes.findIndex(({ id }) => value === id);
    setCategoryTags(categoryTypes[selectedIndex].children);
    form.setFieldsValue({
      tag: undefined
    });
  };

  const setDescription = value => {
    form.setFieldsValue({
      description: value
    });
  };

  const setDetails = value => {
    form.setFieldsValue({
      details: value
    });
  };

  const addNewSizeFields = (prevIndex) => {
    const hasPrevSize = !!form.getFieldValue("sizeOption" + prevIndex);
    if(!hasPrevSize) {
      alert('please enter the size before adding a new one.');
    }
    else{
      const tmpArr = [...sizeFieldsArr];
      tmpArr.push(null);
      setSizeFieldArr(tmpArr);
    }
  };

  const removeSizeFields = (index) => {

  };

  return (
    <Row>
      <Form onSubmit={handleSubmit} className="form-wrapper">
        <Row>
          <Col span={12}>
            <Form.Item label="Name:">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: 'Please enter product name!' }
                ]
              })(<Input placeholder="product name" size="large" />)}
            </Form.Item>
          </Col>
          <Col span={12} />
        </Row>
        <Row gutter={[20, 0]}>
          <Col span={8}>
            <Form.Item label="Category">
              {getFieldDecorator('category', {
                rules: [
                  { required: true, message: 'Please select the category!' }
                ]
              })(
                <Select
                  placeholder="Select a categorty"
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
                  rules: [
                    { required: false, message: 'Please select the type!' }
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
                {getFieldDecorator('tag', {
                  rules: [{ required: true, message: 'Please select the tag!' }]
                })(
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
        <Row>
          <Form.Item label="Description">
            {getFieldDecorator('description')(
              <RichInput
                placeholder="Description"
                onChangeHandler={setDescription}
              />
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label="Details">
            {getFieldDecorator('details')(
              <RichInput placeholder="Details" onChangeHandler={setDetails} />
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label="Main Price">
            {getFieldDecorator('mainPrice')(
              <InputNumber
                size="large"
                formatter={value =>
                  `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value => value.replace(/\€\s?|(,*)/g, '')}
              />
            )}
          </Form.Item>
        </Row>
        <Row>
          <Row>
            <Title level={4}>Sizes</Title>
          </Row>
          {sizeFieldsArr.map((fileds, i) => (
            <Row gutter={[5, 0]}>
              <Col span={3}>
                <Form.Item label="Size:">
                  {getFieldDecorator(`sizeOption${i}`)(
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
                  {getFieldDecorator(`sizeDetail${i}`)(<Input />)}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="Size Price:">
                  {getFieldDecorator(`sizePrice${i}`)(
                    <InputNumber
                      formatter={value =>
                        `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={value => value.replace(/\€\s?|(,*)/g, '')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="Height:">
                  {getFieldDecorator(`sizeHeight${i}`)(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="Chest:">
                  {getFieldDecorator(`sizeChest${i}`)(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="Waist:">
                  {getFieldDecorator(`sizeWaist${i}`)(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="Hips:">
                  {getFieldDecorator(`sizeHips${i}`)(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={3}>
                {i !== sizeFieldsArr.length - 1 ? (
                  <Button className="m-t-43" type="dashed" icon="minus" onClick={() => removeSizeFields(i)}/>
                ) : (
                  <Button className="m-t-43" type="dashed" icon="plus" onClick={() => addNewSizeFields(i)} />
                )}
              </Col>
              <Col span={3}></Col>
            </Row>
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
    </Row>
  );
}

export default Form.create({ name: 'loginForm' })(CreateProduct);
