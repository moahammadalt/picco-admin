import MainLayout from '../layout';
// GeneralViews
import Login from '../pages/Login';
import Home from '../pages/Home';
import CreateProduct from '../pages/CreateProduct';
import Category from '../pages/Category';
import Size from '../pages/Size';
import Color from '../pages/Color';
import Demands from '../pages/Demands';
import Subscribers from '../pages/Subscribers';
import Users from '../pages/Users';
import ProductDetails from '../pages/ProductDetails';

export const dashboardRoutes = [
  {
    path: '/',
    component: Home,
    name: 'Products',
    icon: 'shop',
    showAlways: true
  },
  {
    path: '/create-product',
    component: CreateProduct,
    name: 'Create Product',
    icon: 'upload',
    showAlways: true
  },
  {
    path: '/categories',
    component: Category,
    name: 'Categories',
    icon: 'menu-unfold',
    showAlways: true
  },
  {
    path: '/sizes',
    component: Size,
    name: 'Sizes',
    icon: 'font-size',
    showAlways: true
  },
  {
    path: '/colors',
    component: Color,
    name: 'Colors',
    icon: 'bg-colors',
    showAlways: true
  },
  {
    path: '/demands',
    component: Demands,
    name: 'Demands',
    icon: 'file-search',
    showAlways: true
  },
  {
    path: '/subscribers',
    component: Subscribers,
    name: 'Subscribers',
    icon: 'notification',
    showAlways: true
  },
  {
    path: '/users',
    component: Users,
    name: 'Users',
    icon: 'user',
    showAlways: true
  },
  {
    path: '/product/:productSlug',
    component: ProductDetails,
    name: 'Product details',
    icon: 'team',
    showAlways: false
  }
];

export const baseRoutes = [
  {
    path: '/login',
    component: Login,
    name: 'Dashboard',
    noAuth: true
  },
  {
    path: '/',
    component: MainLayout,
    name: 'Main Layout'
  }
];
