import React, { useContext, useState, useEffect } from 'react';
import { List, Row, Icon, Modal, Input, Button, notification } from 'antd';
import { SketchPicker } from 'react-color';

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
  const [colorsHexArr, setColorArr] = useState([]);

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
    setColorArr([]);
    setNewColorName('');
  };

  const closeUpdateColorModal = () => {
    setUpdateModalItem({});
    setColorArr([]);
  };

  const openUpdateModal = colorItem => {
    setUpdateModalItem(colorItem);
    setUpdateModalItemName(colorItem.name);
    if (colorItem.hex_code) {
      const hexArr = colorItem.hex_code.split(',');
      const tempColorsHexArr = hexArr.map(hex => {
        const colorHexObj = {
          hexCode: hex,
          isVisible: false
        };
        return colorHexObj;
      });
      setColorArr(tempColorsHexArr);
    }
  };

  const setColorHexVisibility = index => {
    const tempColorsHexArr = [...colorsHexArr].map((colorItem, i) => {
      if (index === i) {
        colorItem.isVisible = !colorItem.isVisible;
      }
      return colorItem;
    });
    setColorArr(tempColorsHexArr);
  };

  const setColorHexCode = (hex, index) => {
    if (!index && index !== 0) {
      setColorArr([{ hexCode: null, isVisible: false }]);
      return;
    }
    const tempColorsHexArr = [...colorsHexArr].map((colorItem, i) => {
      if (index === i) {
        colorItem.hexCode = hex;
        colorItem.isVisible = !colorItem.isVisible;
      }
      return colorItem;
    });
    setColorArr(tempColorsHexArr);
  };

  const addColorHexCode = () => {
    const tempColorsHexArr = [...colorsHexArr];
    tempColorsHexArr.push({ hexCode: null, isVisible: false });
    setColorArr(tempColorsHexArr);
  };

  const removeColorHexCode = index => {
    const tempColorsHexArr = [...colorsHexArr];
    tempColorsHexArr.splice(index, 1);
    setColorArr(tempColorsHexArr);
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
        name: updateModalItemName,
        hex_code: colorsHexArr.map(colorItem => colorItem.hexCode).join(',')
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
        slug: extractSlug(newColorName),
        hex_code: colorsHexArr.map(colorItem => colorItem.hexCode).join(',')
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
                {item.hex_code &&
                  item.hex_code.split(',').map((hex, index) => (
                    <span key={index}>
                      {' '}
                      <span style={{ color: hex }}>{hex}</span>{' '}
                      {item.hex_code.split(',').length - 1 !== index && `-`}
                    </span>
                  ))}
              </div>
              <div className="f-r">
                <Icon
                  type="edit"
                  onClick={() => openUpdateModal(item)}
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
        onCancel={closeUpdateColorModal}
      >
        <div className="m-b-10">Name:</div>
        <Input
          value={updateModalItemName}
          className="m-b-30"
          onPressEnter={handleColorUpdate}
          onChange={e => setUpdateModalItemName(e.target.value)}
        />
        <div className="m-b-10">Color Hex:</div>
        {colorsHexArr.length === 0 && (
          <Button onClick={setColorHexCode}>Add Colors hex code</Button>
        )}
        {colorsHexArr.map((colorItem, index) => (
          <div key={index} className="m-t-10">
            <span className="m-r-10">{index + 1}. hex</span>
            <Button
              style={{
                backgroundColor: colorItem.hexCode,
                width: colorItem.hexCode ? '100px' : '200px',
                height: '25px'
              }}
              onClick={() => setColorHexVisibility(index)}
            >
              {!colorItem.hexCode && `Click to set the color`}
            </Button>
            {colorItem.isVisible && (
              <div style={{ position: 'absolute' }}>
                <SketchPicker
                  color={colorItem.hexCode || '#eeeeee'}
                  onChangeComplete={({ hex }) => setColorHexCode(hex, index)}
                />
              </div>
            )}
            <Button
              style={{ height: '25px' }}
              className="m-l-20"
              icon="minus"
              onClick={() => removeColorHexCode(index)}
            />
            {index === colorsHexArr.length - 1 && (
              <Button
                style={{ height: '25px' }}
                className="m-l-5"
                icon="plus"
                onClick={addColorHexCode}
              />
            )}
          </div>
        ))}
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
        <div className="m-b-10">Color Hex:</div>
        {colorsHexArr.length === 0 && (
          <Button onClick={setColorHexCode}>Add Colors hex code</Button>
        )}
        {colorsHexArr.map((colorItem, index) => (
          <div key={index} className="m-t-10">
            <span className="m-r-10">{index + 1}. hex</span>
            <Button
              style={{
                backgroundColor: colorItem.hexCode,
                width: colorItem.hexCode ? '100px' : '200px',
                height: '25px'
              }}
              onClick={() => setColorHexVisibility(index)}
            >
              {!colorItem.hexCode && `Click to set the color`}
            </Button>
            {colorItem.isVisible && (
              <div style={{ position: 'absolute' }}>
                <SketchPicker
                  color={colorItem.hexCode || '#eeeeee'}
                  onChangeComplete={({ hex }) => setColorHexCode(hex, index)}
                />
              </div>
            )}
            <Button
              style={{ height: '25px' }}
              className="m-l-20"
              icon="minus"
              onClick={() => removeColorHexCode(index)}
            />
            {index === colorsHexArr.length - 1 && (
              <Button
                style={{ height: '25px' }}
                className="m-l-5"
                icon="plus"
                onClick={addColorHexCode}
              />
            )}
          </div>
        ))}
      </Modal>
    </Row>
  );
}

export default Color;
