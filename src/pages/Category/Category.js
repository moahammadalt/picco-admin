import React, { useContext, useState, useEffect } from 'react';
import { Tree, Input, Modal, Row, Icon, notification, Button } from 'antd';

import { StoreContext } from '../../contexts';
import { getParentChildArr } from '../../utils/helpers';
import { useFetch } from '../../hooks';
import { URLS } from '../../constants';

import '../../assets/scss/category.scss';

const { TreeNode } = Tree;
const { Search } = Input;

function Category() {
  const {
    data: { categories = [] },
    doCategoriesFetch,
  } = useContext(StoreContext);
  const categoriesList = getParentChildArr(categories);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState({});
  const [updateModalItem, setUpdateModalItem] = useState({});
  const [updateModalItemName, setUpdateModalItemName] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const { doFetch: doDeleteFetch} = useFetch();
  const { doFetch: doUpdateFetch } = useFetch();

  useEffect(() => {
    if(categoriesList && categoriesList.length && expandedKeys.length === 0) {
      setExpandedKeys(categoriesList.map(category => category.id));
    }
    console.log('expandedKeys', expandedKeys);
  }, [categoriesList])

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
    if(!updateModalItemName) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Please fill the category name!',
        duration: 4,
      });
      return;
    }
    doUpdateFetch({
      url: URLS.categoryUpdate({ slug: updateModalItem.slug }),
      params: {
        name: updateModalItemName,
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Category ${deleteModalItem.name} has been updated`,
      onSuccess: data => {
        doCategoriesFetch();
        setUpdateModalItem({});
        setUpdateModalItemName('');
      }
    });
  };

  const handleCategoryCreate = () => {
    console.log('ffff');
  }

  const getUpdateIcon = (item) => (
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

  const getDeleteIcon = (item) => (
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
            {item.children.length === 0 && getDeleteIcon(item)}
          </h3>
        ) : (
          <h3 className="category-item">
            {item.name}
            {getUpdateIcon(item)}
            {item.children.length === 0 && getDeleteIcon(item)}
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
      <Button className="category-add-btn" type="primary" icon="folder-add" onClick={() => setCreateCategoryModalOpen(true)}>Add New Category</Button>
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
        onCancel={() => setCreateCategoryModalOpen(false)}
      >
        some shit
      </Modal>
    </Row>
  );
}

export default Category;
