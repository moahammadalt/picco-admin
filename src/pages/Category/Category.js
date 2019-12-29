import React, { useContext, useState, useEffect } from 'react';
import {
  Tree,
  Input,
  Modal,
  Row,
  Icon,
  notification,
  Button,
  Form,
  Select
} from 'antd';

import { StoreContext, LayoutContext } from '../../contexts';
import { getParentChildArr, extractSlug } from '../../utils/helpers';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';

import '../../assets/scss/category.scss';

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = Select;

function Category({ form }) {
  const {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    resetFields
  } = form;
  const {
    data: { categories = [] },
    doCategoriesFetch
  } = useContext(StoreContext);
  const { setHeaderComponent } = useContext(LayoutContext);
  const categoriesList = getParentChildArr(categories);

  const prevCategories = usePrevious(categories);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [deleteModalItem, setDeleteModalItem] = useState({});
  const [updateModalItem, setUpdateModalItem] = useState({});
  const [updateModalItemName, setUpdateModalItemName] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const { doFetch: doDeleteFetch } = useFetch();
  const { doFetch: doUpdateFetch } = useFetch();
  const { doFetch: doCreateFetch } = useFetch();

  useEffect(() => {
    if (categoriesList && categoriesList.length && expandedKeys.length === 0) {
      setExpandedKeys(categoriesList.map(category => category.id));
    }
  }, [categoriesList]);

  useEffect(() => {
    const categoriesChanged =
      JSON.stringify(categories) !== JSON.stringify(prevCategories);
    categoriesChanged &&
      setHeaderComponent(<b>Total categories {categories.length}</b>);
    return () => {
      setHeaderComponent(null);
    };
  }, [categories]);

  const dataList = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, name } = node;
      dataList.push({ key, name });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  generateList(categoriesList);

  const handleTreeExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  };

  const handleSearchChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.name && item.name.indexOf(value) > -1) {
          return getParentKey(item.key, categoriesList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setSearchValue(value);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  };

  const handleCategoryDelete = () => {
    doDeleteFetch({
      url: URLS.categoryDelete({ slug: deleteModalItem.slug }),
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Category ${deleteModalItem.name} has been deleted`,
      onSuccess: data => {
        doCategoriesFetch();
        setDeleteModalItem({});
      }
    });
  };

  const handleCategoryUpdate = () => {
    if (!updateModalItemName) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Please fill the category name!',
        duration: 4
      });
      return;
    }
    doUpdateFetch({
      url: URLS.categoryUpdate({ slug: updateModalItem.slug }),
      params: {
        name: updateModalItemName
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Category ${updateModalItemName} has been updated`,
      onSuccess: data => {
        doCategoriesFetch();
        setUpdateModalItem({});
        setUpdateModalItemName('');
      }
    });
  };

  const onCategoryChanged = value => {
    const selectedIndex = categoriesList.findIndex(({ id }) => value === id);
    setCategoryTypes(categoriesList[selectedIndex].children);
    setFieldsValue({
      parentType: undefined
    });
  };

  const closeCreateCategoryModal = () => {
    setCreateCategoryModalOpen(false);
    setCategoryTypes([]);
    resetFields();
  };

  const handleCategoryCreate = async e => {
    e.preventDefault();
    const { categoryName, parentCategory, parentType } = await validateFields();
    doCreateFetch({
      url: URLS.categoryCreate,
      params: {
        name: categoryName,
        slug: extractSlug(categoryName),
        parent_id: parentType || parentCategory
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Category ${categoryName} has been created`,
      onSuccess: data => {
        doCategoriesFetch();
        closeCreateCategoryModal();
      }
    });
  };

  const getUpdateIcon = item => (
    <Icon
      type="edit"
      onClick={() => {
        setUpdateModalItem(item);
        setUpdateModalItemName(item.name);
      }}
      className="m-l-20 m-r-15"
      theme="twoTone"
      twoToneColor="#1890ff"
    />
  );

  const getDeleteIcon = item => (
    <Icon
      type="delete"
      onClick={() => setDeleteModalItem(item)}
      theme="twoTone"
      twoToneColor="#f5222d"
    />
  );

  const loop = data =>
    data.map((item, itemIndex) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <h3 className="category-item">
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
            {getUpdateIcon(item)}
            {getDeleteIcon(item)}
          </h3>
        ) : (
          <h3 className="category-item">
            {item.name}
            {getUpdateIcon(item)}
            {getDeleteIcon(item)}
          </h3>
        );
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
  return (
    <Row>
      <Button
        className="category-add-btn"
        type="primary"
        icon="folder-add"
        onClick={() => setCreateCategoryModalOpen(true)}
      >
        Add New Category
      </Button>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={handleSearchChange}
      />
      <Tree
        onExpand={handleTreeExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {loop(categoriesList)}
      </Tree>

      <Modal
        title={`Delete category - ${deleteModalItem.name}`}
        visible={!!deleteModalItem.id}
        onOk={handleCategoryDelete}
        onCancel={() => setDeleteModalItem({})}
      >
        would you really like to Delete <b>{deleteModalItem.name}</b> category?
      </Modal>

      <Modal
        title={`Update category - ${updateModalItem.name}`}
        visible={!!updateModalItem.id}
        onOk={handleCategoryUpdate}
        onCancel={() => setUpdateModalItem({})}
      >
        <Input
          value={updateModalItemName}
          onPressEnter={handleCategoryUpdate}
          onChange={e => setUpdateModalItemName(e.target.value)}
        />
      </Modal>

      <Modal
        title={`Create new category`}
        visible={createCategoryModalOpen}
        onOk={handleCategoryCreate}
        okText="Create"
        onCancel={closeCreateCategoryModal}
      >
        <Form onSubmit={handleCategoryCreate} className="login-form">
          <Form.Item label="Name">
            {getFieldDecorator('categoryName', {
              rules: [
                { required: true, message: 'Please enter category name!' }
              ]
            })(<Input placeholder="Name" size="large" />)}
          </Form.Item>
          <Form.Item label="Under Category">
            {getFieldDecorator('parentCategory')(
              <Select
                placeholder="Select a category"
                onChange={onCategoryChanged}
              >
                {categoriesList.map((cat, index) => (
                  <Option value={cat.id} key={index}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {categoryTypes.length > 0 && (
            <Form.Item label="Under Type">
              {getFieldDecorator('parentType')(
                <Select placeholder="Select a type">
                  {categoryTypes.map((cat, index) => (
                    <Option value={cat.id} key={index}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Row>
  );
}

export default Form.create({ name: 'categoryForm' })(Category);
