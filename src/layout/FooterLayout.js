import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

function FooterLayout() {
  return (<Footer>piccoloveliero ©{new Date().getFullYear()}</Footer>);
}

export default FooterLayout;