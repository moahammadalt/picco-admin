import {
  FIRST_INDEX,
  LAST_INDEX,
  SORT_INDEX_STEP,
  SORT_INDEX_DIGITS_NUMBER
} from '../constants';
import { createHash } from './helpers';

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
  return !sizesArr[0].id ? [] : sizesArr;
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
        images: values[`colorImages${colorIndex}`]
          ? values[`colorImages${colorIndex}`].map(imgObj => ({
              image_name: imgObj.name
            }))
          : [],
        amount: values[`colorAmount${colorIndex}`]
      };
    });
  return !colorsArr[0].id ? [] : colorsArr.reverse();
};

export const extractDefaultColorId = values => {
  const defaultColorInArr = Object.keys(values).filter(
    key => key.startsWith('colorDefault') && !!values[key]
  );

  if (defaultColorInArr.length === 0) return;

  const defaultColorIndex =
    defaultColorInArr[0][defaultColorInArr[0].length - 1];
  return values[`colorOption${defaultColorIndex}`];
};

export const extractProductPlace = (sortIndex, productsList) => {
  const productsListHashObj = createHash(productsList, 'id');
  const productsIndexesArr = productsListHashObj
    .values()
    .map(({ sort_index }) => sort_index);

  const isFirstProduct = sortIndex === Math.min(...productsIndexesArr);
  const isLastProduct = sortIndex === Math.max(...productsIndexesArr);
  
  const getPlaceInBetween = () =>
    Math.min(...productsIndexesArr.filter(number => number > sortIndex));

  switch (true) {
    case isFirstProduct:
      return FIRST_INDEX;

    case isLastProduct:
      return LAST_INDEX;

    default:
      return getPlaceInBetween();
  }
};

export const extractProductIndex = ({ sortPlace }, productsList) => {
  const productsListHashObj = createHash(productsList, 'id');
  const productsIndexesArr = productsListHashObj
    .values()
    .map(({ sort_index }) => sort_index);
  const firstProductId = Number(productsListHashObj.keys()[0]);
  let sortIndex;

  switch (sortPlace) {
    case LAST_INDEX:
      sortIndex = null;
      break;

    case FIRST_INDEX:
    case firstProductId:
      const minIndex = Math.min(...productsIndexesArr);
      sortIndex = Number(
        Number(minIndex - 0.1 + SORT_INDEX_STEP).toFixed(
          SORT_INDEX_DIGITS_NUMBER
        )
      );
      break;

    default:
      const beforeIndex = productsListHashObj.data[sortPlace].sort_index;
      const nearestSmallestIndex = Math.max(
        ...productsIndexesArr.filter(number => number < beforeIndex)
      );
      sortIndex = Number(
        Number(nearestSmallestIndex + SORT_INDEX_STEP).toFixed(
          SORT_INDEX_DIGITS_NUMBER
        )
      );
      while (productsIndexesArr.includes(sortIndex)) {
        sortIndex = Number(
          Number(sortIndex + SORT_INDEX_STEP).toFixed(SORT_INDEX_DIGITS_NUMBER)
        );
      }
      break;
  }

  return sortIndex;
};
