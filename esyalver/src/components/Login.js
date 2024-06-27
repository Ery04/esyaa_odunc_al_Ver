import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.get('https://v1.nocodeapi.com/esyalveree/google_sheets/hBdATZZuaBkJNrzK?tabId=sayfa1');

      const users = response.data.data;
      const user = users.find(user => user.name === values.name && user.password === values.password);

      if (user) {
        message.success('Giriş Yapıldı');
        localStorage.setItem('name', user.name); // Set the username in localStorage
        navigate('/add-items', { state: { userName: user.name } }); // Pass username as state
      } else {
        message.error('Giriş yapılamadı');
      }
    } catch (error) {
      message.error('An error occurred!');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Kullanıcı Adı"
        name="name"
        rules={[{ required: true, message: 'Kullanıcı Adı gir' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="şifre"
        name="password"
        rules={[{ required: true, message: 'Şifre gir' }]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Giriş yap
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
