import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Button } from 'antd';
import Register from './components/Register';
import Login from './components/Login';
import AddItems from './components/AddItems';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    
      <Layout className="layout">
        <Header>
          <div className="logo" />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content" style={{ margin: '16px 0' }}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/add-items" element={<AddItems />} />
              <Route path="/" element={<Login />} />
            </Routes>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/register">
                <Button type="primary">Register</Button>
              </Link>
              <Link to="/login" style={{ marginLeft: '10px' }}>
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023</Footer>
      </Layout>
  
  );
}

export default App;
