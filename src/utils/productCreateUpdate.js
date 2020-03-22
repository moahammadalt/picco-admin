import { notification } from 'antd';

import {
  FIRST_INDEX,
  LAST_INDEX,
  SORT_INDEX_STEP,
  SORT_INDEX_DIGITS_NUMBER
} from '../constants';
import { createHash, extractSlug, arrayHasDuplicates } from './helpers';

export const extractSizesArr = (values = {}) => {
  const sizesArr = Object.keys(values)
    .filter(key => key.startsWith('sizeOption'))
    .map(key => {
      const sizeIndex = key[key.length - 1];
      return {
        is_checked: true,
        refId: values[`sizeRefId${sizeIndex}`],
        id: values[`sizeOption${sizeIndex}`],
        details: values[`sizeDetail${sizeIndex}`],
        height: values[`sizeHeight${sizeIndex}`],
        hips: values[`sizeHips${sizeIndex}`],
        chest: values[`sizeChest${sizeIndex}`],
        waist: values[`sizeWaist${sizeIndex}`],
        neck: values[`sizeNeck${sizeIndex}`],
        shoulders: values[`sizeShoulders${sizeIndex}`],
        sleeves: values[`sizeSleeves${sizeIndex}`],
        length: values[`sizeLength${sizeIndex}`],
        total_height: values[`sizeTotalHeight${sizeIndex}`],
        head_circumference: values[`sizeHeadCircumference${sizeIndex}`],
        foot_length: values[`sizeFootLength${sizeIndex}`],
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
        refId: values[`colorRefId${colorIndex}`],
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
  const productsListHashObj = createHash(productsList, 'sort_index');
  const productsIndexesArr = productsList.map(({ sort_index }) => sort_index);

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
      const placeInBetween = getPlaceInBetween();
      return placeInBetween === Infinity
        ? LAST_INDEX
        : productsListHashObj.data[placeInBetween].id;
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

export const extractProductObj = (values, productsList) => ({
  name: values.name,
  slug: extractSlug(values.name),
  category_id: values.category,
  category_type_id: values.type,
  description: values.description,
  details: values.details,
  price: values.mainPrice,
  currency: 'EUR',
  is_best: values.isBest ? '1' : '0',
  is_handmade: values.isHandmade ? '1' : '0',
  stock_status: values.isOutOfStuck ? '0' : '1',
  default_color_id: extractDefaultColorId(values),
  sort_index: extractProductIndex(values, productsList),
  sizes: extractSizesArr(values),
  colors: extractColorsArr(values)
});

export const validateProduct = paramsObj => {
  let errorMessage;

  if (paramsObj.colors.length === 0) {
    errorMessage = 'There should be at least one color added.';
  }
  if (paramsObj.sizes.length === 0) {
    errorMessage = 'There should be at least one size added.';
  }

  const colorsIds = paramsObj.colors.map(color => color.id);
  if (arrayHasDuplicates(colorsIds)) {
    errorMessage =
      'Colors can not be duplicated, each color should be different from the other.';
  }

  const sizesIds = paramsObj.sizes.map(size => size.id);
  if (arrayHasDuplicates(sizesIds)) {
    errorMessage =
      'Sizes can not be duplicated, each size should be different from the other.';
  }

  if (!!errorMessage) {
    notification.warning({
      placement: 'bottomRight',
      errorMessage: 'An error occured!',
      duration: 7,
      description: errorMessage
    });
    return false;
  } else {
    return true;
  }
};
