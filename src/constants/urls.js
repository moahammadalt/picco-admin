const URLS = {
  login: '/login',
  dashboardRetrive: '/dashboard-retrive',
  categoryList: '/category',
  sizeList: '/size',
  colorList: '/color',
  imageUpload: '/productImage/create',
  productCreate: '/product/create',
  productListGet: '/product',
  productDelete: ({ slug }) => `/product/${slug}/delete`,
}

export default URLS;