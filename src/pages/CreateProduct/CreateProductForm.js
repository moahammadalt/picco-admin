import React, { useContext, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, InputNumber } from 'antd';

import RichInput from '../../components/RichInput';

import { getParentChildArr } from '../../utils/helpers';
import { StoreContext } from '../../contexts';
import '../../assets/scss/createProductForm.scss';

function CreateProduct({ form, handleFormSubmit }) {
  const {
    data: { categoryies = [] }
  } = useContext(StoreContext);
  const categories = getParentChildArr(categoryies);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categoryTags, setCategoryTags] = useState([]);

  const { Option } = Select;
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = async e => {
    e.preventDefault();
    const values = await validateFields();
    handleFormSubmit(values);
  };

  const onCategoryChanged = value => {
    const selectedIndex = categories.findIndex(({ id }) => value === id);
    setCategoryTypes(categories[selectedIndex].children);
    form.setFieldsValue({
      type: undefined,
    });
  };

  const onCategoryTypeChanged = value => {
    const selectedIndex = categoryTypes.findIndex(({ id }) => value === id);
    setCategoryTags(categoryTypes[selectedIndex].children);
    form.setFieldsValue({
      tag: undefined,
    });
  };

  const setDescription = value => {
    form.setFieldsValue({
      description: value,
    });
  }

  const setDetails = value => {
    form.setFieldsValue({
      details: value,
    });
  }

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
                  {categories.map((cat, index) => (
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
              <RichInput
                placeholder="Details"
                onChangeHandler={setDetails}
              />
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label="Main Price">
            {getFieldDecorator('mainPrice')(
              <InputNumber
                size="large"
                defaultValue={1000}
                formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\€\s?|(,*)/g, '')}
              />
            )}
          </Form.Item>
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
        <Row>
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
