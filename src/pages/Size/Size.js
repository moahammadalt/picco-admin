import React, { useContext, useState, useEffect } from 'react';
import { List, Row, Icon, Modal, Input, Button, notification } from 'antd';

import { StoreContext, LayoutContext } from '../../contexts';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';
import { extractSlug } from '../../utils/helpers';

function Size() {
  const {
    data: { sizes = [] },
    doSizesFetch
  } = useContext(StoreContext);
  const { setHeaderComponent } = useContext(LayoutContext);

  const prevSizes = usePrevious(sizes);

  const [deleteModalItem, setDeleteModalItem] = useState({});
  const [updateModalItem, setUpdateModalItem] = useState({});
  const [updateModalItemName, setUpdateModalItemName] = useState('');
  const [createSizeModalOpen, setCreateSizeModalOpen] = useState(false);
  const [newSizeName, setNewSizeName] = useState('');

  const { doFetch: doCreateFetch } = useFetch();
  const { doFetch: doUpdateFetch } = useFetch();
  const { doFetch: doDeleteFetch } = useFetch();

  useEffect(() => {
    const sizeIsChanged = JSON.stringify(sizes) !== JSON.stringify(prevSizes);
    sizeIsChanged && setHeaderComponent(<b>Total sizes {sizes.length}</b>);
    return () => {
      setHeaderComponent(null);
    };
  }, [sizes]);

  const closeCreateSizeModal = () => {
    setCreateSizeModalOpen(false);
    setNewSizeName('');
  };

  const handleSizeDelete = () => {
    doDeleteFetch({
      url: URLS.sizeDelete({ slug: deleteModalItem.slug }),
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Size ${deleteModalItem.name} has been deleted`,
      onSuccess: data => {
        doSizesFetch();
        setDeleteModalItem({});
      }
    });
  };

  const handleSizeUpdate = () => {
    if (!updateModalItemName) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Please fill the size name!',
        duration: 4
      });
      return;
    }
    doUpdateFetch({
      url: URLS.sizeUpdate({ slug: updateModalItem.slug }),
      params: {
        name: updateModalItemName
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Size ${updateModalItemName} has been updated`,
      onSuccess: data => {
        doSizesFetch();
        setUpdateModalItem({});
        setUpdateModalItemName('');
      }
    });
  };

  const handleSizeCreate = () => {
    if (!newSizeName) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Please fill the size name!',
        duration: 4
      });
      return;
    }
    doCreateFetch({
      url: URLS.sizeCreate,
      params: {
        name: newSizeName,
        slug: extractSlug(newSizeName)
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Size ${newSizeName} has been created`,
      onSuccess: data => {
        doSizesFetch();
        closeCreateSizeModal();
      }
    });
  };

  return (
    <Row>
      <Row>
        <Button
          className="f-r"
          type="primary"
          icon="folder-add"
          onClick={() => setCreateSizeModalOpen(true)}
        >
          Add New Category
        </Button>
      </Row>
      <h3 style={{ marginBottom: 16 }}>Available Sizes:</h3>
      <List
        bordered
        dataSource={sizes}
        renderItem={item => (
          <List.Item className="f-s-20">
            {item.name}
            <div className="f-r">
              <Icon
                type="edit"
                onClick={() => {
                  setUpdateModalItem(item);
                  setUpdateModalItemName(item.name);
                }}
                className="m-l-20 m-r-30"
                theme="twoTone"
                twoToneColor="#1890ff"
              />
              <Icon
                type="delete"
                onClick={() => setDeleteModalItem(item)}
                theme="twoTone"
                twoToneColor="#f5222d"
              />
            </div>
          </List.Item>
        )}
      />

      <Modal
        title={`Delete size - ${deleteModalItem.name}`}
        visible={!!deleteModalItem.id}
        onOk={handleSizeDelete}
        onCancel={() => setDeleteModalItem({})}
      >
        would you really like to Delete <b>{deleteModalItem.name}</b> size?
      </Modal>

      <Modal
        title={`Update size - ${updateModalItem.name}`}
        visible={!!updateModalItem.id}
        onOk={handleSizeUpdate}
        onCancel={() => setUpdateModalItem({})}
      >
        <Input
          value={updateModalItemName}
          onPressEnter={handleSizeUpdate}
          onChange={e => setUpdateModalItemName(e.target.value)}
        />
      </Modal>

      <Modal
        title="Create new size"
        visible={createSizeModalOpen}
        onOk={handleSizeCreate}
        onCancel={closeCreateSizeModal}
      >
        name:
        <Input
          value={newSizeName}
          onPressEnter={handleSizeCreate}
          onChange={e => setNewSizeName(e.target.value)}
        />
      </Modal>
    </Row>
  );
}

export default Size;
