import MainLayout from '../layout';
// GeneralViews
import Login from '../pages/Login';
import Home from '../pages/Home';
import CreateProduct from '../pages/CreateProduct';
import Category from '../pages/Category';
import Size from '../pages/Size';
import Color from '../pages/Color';
import ProductDetails from '../pages/ProductDetails';

export const dashboardRoutes = [
  {
    path: '/',
    component: Home,
    name: "Products",
    icon: "shop",
    showAlways: true,
  },
  {
    path: '/create-product',
    component: CreateProduct,
    name: "Create Product",
    icon: "upload",
    showAlways: true,
  },
  {
    path: '/categories',
    component: Category,
    name: "Categories",
    icon: "menu-unfold",
    showAlways: true,
  },
  {
    path: '/sizes',
    component: Size,
    name: "Sizes",
    icon: "menu-unfold",
    showAlways: true,
  },
  {
    path: '/colors',
    component: Color,
    name: "Colors",
    icon: "menu-unfold",
    showAlways: true,
  },
  {
    path: '/product/:productSlug',
    component: ProductDetails,
    name: "Product details",
    icon: "team",
    showAlways: false,
  },
];
export const baseRoutes = [
  {
    path: '/login',
    component: Login,
    name: "Dashboard",
    noAuth: true,
  },
  {
    path: '/',
    component: MainLayout,
    name: "Main Layout",
  },
];