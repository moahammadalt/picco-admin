const URLS = {
  login: '/login',
  dashboardRetrive: '/dashboard-retrive',
  categoryList: '/category',
  sizeList: '/size',
  colorList: '/color',
  imageUpload: '/productImage/create',
  productCreate: '/product/create',
  productListGet: '/product',
  productItemGet: ({ slug }) => `/product/${slug}`,
  productDelete: ({ slug }) => `/product/${slug}/delete`,
  categoryDelete: ({ slug }) => `/category/${slug}/delete`,
  categoryUpdate: ({ slug }) => `/category/${slug}/update`,
  categoryCreate: '/category/create',
  sizeCreate: '/size/create',
  sizeDelete: ({ slug }) => `/size/${slug}/delete`,
  sizeUpdate: ({ slug }) => `/size/${slug}/update`,
  colorCreate: '/color/create',
  colorDelete: ({ slug }) => `/color/${slug}/delete`,
  colorUpdate: ({ slug }) => `/color/${slug}/update`,
}

export default URLS;