import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthdate: null,
    email: '',
    phonenumber: '',
    password: '',
  });

  const onFinish = async () => {
    const formattedData = {
      ...formData,
      birthdate: formData.birthdate ? moment(formData.birthdate).format('DD.MM.YYYY') : null,
    };

    try {
      await axios({
        method: 'post',
        url: 'https://v1.nocodeapi.com/esyalveree/google_sheets/hBdATZZuaBkJNrzK?tabId=sayfa1',
        data: [Object.values(formattedData)],
      });
      message.success('Kayıt yapıldı');
      setFormData({
        name: '',
        surname: '',
        birthdate: null,
        email: '',
        phonenumber: '',
        password: '',
      });
    } catch (error) {
      message.error('An error occurred!');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="register"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="isim"
        name="name"
        rules={[{ required: true, message: 'İsim giriniz' }]}
      >
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </Form.Item>

      <Form.Item
        label="soyisim"
        name="surname"
        rules={[{ required: true, message: 'Soyisim giriniz' }]}
      >
        <Input value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} />
      </Form.Item>

      <Form.Item
        label="doğum tarihi"
        name="birthdate"
        rules={[{ required: true, message: 'Doğum tarihi giriniz' }]}
      >
        <DatePicker
          value={formData.birthdate}
          onChange={(date) => setFormData({ ...formData, birthdate: date })}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'email giriniz' }, { type: 'email', message: 'geçersiz email' }]}
      >
        <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      </Form.Item>

      <Form.Item
        label="Telefon numarası"
        name="phonenumber"
        rules={[{ required: true, message: 'Telefon numarası gir' }]}
      >
        <Input value={formData.phonenumber} onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })} />
      </Form.Item>

      <Form.Item
        label="şifre"
        name="password"
        rules={[{ required: true, message: 'şifre gir' }]}
      >
        <Input.Password value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Kayıt Ol
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
