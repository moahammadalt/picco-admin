export const extractSlug = (name = '') => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export const extractSizesArr = (values = {}) => {
  const sizesArr = Object.keys(values)
    .filter(key => key.startsWith('sizeOption'))
    .map(key => {
      const sizeIndex = key[key.length - 1];
      return {
        is_checked: true,
        id: values[`sizeOption${sizeIndex}`],
        details: values[`sizeDetail${sizeIndex}`],
        height: values[`sizeHeight${sizeIndex}`],
        hips: values[`sizeHips${sizeIndex}`],
        chest: values[`sizeChest${sizeIndex}`],
        waistline: values[`sizeWaist${sizeIndex}`],
        size_price: values[`sizePrice${sizeIndex}`],
        amount: values[`sizeAmount${sizeIndex}`]
      };
    });
  return (!sizesArr[0].id ? [] : sizesArr);
};

export const extractColorsArr = values => {
  const colorsArr = Object.keys(values)
  .filter(key => key.startsWith('colorOption'))
  .map(key => {
    const colorIndex = key[key.length - 1];
    return {
      is_checked: true,
      id: values[`colorOption${colorIndex}`],
      product_color_code: values[`colorCode${colorIndex}`],
      images: values[`colorImages${colorIndex}`] ? values[`colorImages${colorIndex}`].map(imgObj => ({
        image_name: imgObj.name
      })) : [],
      amount: values[`colorAmount${colorIndex}`]
    };
  });
  return (!colorsArr[0].id ? [] : colorsArr);
};

export const extractDefaultColorId = (values) => {
  const defaultColorInArr = Object.keys(values).filter(key => key.startsWith('colorDefault') && !!values[key]);

  if(defaultColorInArr.length === 0) return;

  const defaultColorIndex = defaultColorInArr[0][defaultColorInArr[0].length - 1];
  return values[`colorOption${defaultColorIndex}`];
}
