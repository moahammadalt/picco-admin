import React, { useContext, useState, useEffect } from 'react';
import { List, Row, Icon, Modal, Input, Button, notification } from 'antd';
//import { SketchPicker } from 'react-color';

import { StoreContext, LayoutContext } from '../../contexts';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';
import { extractSlug } from '../../utils/helpers';

function Color() {
  const {
    data: { colors = [] },
    doColorsFetch
  } = useContext(StoreContext);
  const { setHeaderComponent } = useContext(LayoutContext);

  const prevColors = usePrevious(colors);

  const [deleteModalItem, setDeleteModalItem] = useState({});
  const [updateModalItem, setUpdateModalItem] = useState({});
  const [updateModalItemName, setUpdateModalItemName] = useState('');
  const [createColorModalOpen, setCreateColorModalOpen] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  //const [selectedColorHex, setSelectedColorHex] = useState('');
  //const [colorPickerIsVisible, setColorPickerIsVisible] = useState(false);

  const { doFetch: doCreateFetch } = useFetch();
  const { doFetch: doUpdateFetch } = useFetch();
  const { doFetch: doDeleteFetch } = useFetch();

  useEffect(() => {
    const colorIsChanged =
      JSON.stringify(colors) !== JSON.stringify(prevColors);
    colorIsChanged && setHeaderComponent(<b>Total colors {colors.length}</b>);
    return () => {
      setHeaderComponent(null);
    };
  }, [colors]);

  const closeCreateColorModal = () => {
    setCreateColorModalOpen(false);
    //setColorPickerIsVisible(false);
    //setSelectedColorHex('');
    setNewColorName('');
  };

  const handleColorDelete = () => {
    doDeleteFetch({
      url: URLS.colorDelete({ slug: deleteModalItem.slug }),
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Color ${deleteModalItem.name} has been deleted`,
      onSuccess: data => {
        doColorsFetch();
        setDeleteModalItem({});
      }
    });
  };

  const handleColorUpdate = () => {
    if (!updateModalItemName) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Please fill the color name!',
        duration: 4
      });
      return;
    }
    doUpdateFetch({
      url: URLS.colorUpdate({ slug: updateModalItem.slug }),
      params: {
        name: updateModalItemName
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Color ${updateModalItemName} has been updated`,
      onSuccess: data => {
        doColorsFetch();
        setUpdateModalItem({});
        setUpdateModalItemName('');
      }
    });
  };

  const handleColorCreate = () => {
    if (!newColorName) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Please fill the color name!',
        duration: 4
      });
      return;
    }
    doCreateFetch({
      url: URLS.colorCreate,
      params: {
        name: newColorName,
        slug: extractSlug(newColorName)
      },
      method: 'POST',
      showSuccessNotification: true,
      successMessage: `Color ${newColorName} has been created`,
      onSuccess: data => {
        doColorsFetch();
        closeCreateColorModal();
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
          onClick={() => setCreateColorModalOpen(true)}
        >
          Add New Category
        </Button>
      </Row>
      <h3 style={{ marginBottom: 16 }}>Available Colors:</h3>
      <List
        bordered
        dataSource={colors}
        renderItem={item => (
          <List.Item className="f-s-20">
            <div className="w-100">
              <div className="f-l">
                <span className="m-r-30">{item.name}</span>
                {/* <span style={{ color: item.hex_code }}>{item.hex_code}</span> */}
              </div>
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
            </div>
          </List.Item>
        )}
      />

      <Modal
        title={`Delete color - ${deleteModalItem.name}`}
        visible={!!deleteModalItem.id}
        onOk={handleColorDelete}
        onCancel={() => setDeleteModalItem({})}
      >
        would you really like to Delete <b>{deleteModalItem.name}</b> color?
      </Modal>

      <Modal
        title={`Update color - ${updateModalItem.name}`}
        visible={!!updateModalItem.id}
        onOk={handleColorUpdate}
        onCancel={() => setUpdateModalItem({})}
      >
        <div className="m-b-10">Name:</div>
        <Input
          value={updateModalItemName}
          className="m-b-30"
          onPressEnter={handleColorUpdate}
          onChange={e => setUpdateModalItemName(e.target.value)}
        />
        {/* <div className="m-b-10">Color Hex:</div>
        <Button
          style={{ backgroundColor: updateModalItem.hex_code }}
          onClick={() => setColorPickerIsVisible(!colorPickerIsVisible)}
        ></Button>
        {colorPickerIsVisible && (
          <div style={{ position: 'absolute' }}>
            <SketchPicker
              color={updateModalItem.hex_code || '#fff'}
              onChangeComplete={({ hex }) => setUpdateModalItem({
                ...updateModalItem,
                hex_code: hex,
              })}
            />
          </div>
        )} */}
      </Modal>

      <Modal
        title="Create new color"
        visible={createColorModalOpen}
        onOk={handleColorCreate}
        onCancel={closeCreateColorModal}
      >
        <div className="m-b-10">Name:</div>
        <Input
          value={newColorName}
          className="m-b-30"
          onPressEnter={handleColorCreate}
          onChange={e => setNewColorName(e.target.value)}
        />
        {/* <div className="m-b-10">Color Hex:</div>
        <Button
          style={{ backgroundColor: selectedColorHex }}
          onClick={() => setColorPickerIsVisible(!colorPickerIsVisible)}
        ></Button>
        {colorPickerIsVisible && (
          <div style={{ position: 'absolute' }}>
            <SketchPicker
              color={selectedColorHex}
              onChangeComplete={({ hex }) => setSelectedColorHex(hex)}
            />
          </div>
        )} */}
      </Modal>
    </Row>
  );
}

export default Color;
