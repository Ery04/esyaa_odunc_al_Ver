import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, List, Modal, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';

const AddItems = () => {
  const location = useLocation();
  const { userName } = location.state || {}; 
  const [items, setItems] = useState([]);
  const name = localStorage.getItem('name'); 
  const [myItems, setMyItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [loanDays, setLoanDays] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [borrowedModalVisible, setBorrowedModalVisible] = useState(false);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [form] = Form.useForm();
  const [todayDate, setTodayDate] = useState(moment().format('DD.MM.YYYY'));
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchDataAndClearAPI();
  }, []);

  const fetchDataAndClearAPI = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://v1.nocodeapi.com/esyalveree/google_sheets/vicXrzONkFQqdgDU?tabId=sayfa1',
      });

      const allItems = response.data.data.map((item) => ({
        itemName: item.itemName,
        loanDays: item.loanDays,
        returnDate: moment().add(item.loanDays, 'days').format('DD.MM.YYYY'),
        owner: item.owner,
      }));

      setItems(allItems);

      
      const userItems = allItems.filter(item => item.owner === name);
      setMyItems(userItems);

     

      message.success('Data fetched and cleared successfully');
    } catch (error) {
      console.error('An error occurred while fetching and clearing data:', error);
      
    }
  };

  const addItem = async () => {
    if (!itemName || !loanDays) {
      message.error('Please fill in all fields');
      return;
    }

    const newItem = { itemName, loanDays, returnDate: moment().add(loanDays, 'days').format('DD.MM.YYYY'), owner: name };
    setItems([...items, newItem]);
    setMyItems([...myItems, newItem]);
    setItemName('');
    setLoanDays('');
    message.success('Eşya listeye eklendi');

    try {
      await axios({
        method: 'post',
        url: 'https://v1.nocodeapi.com/esyalveree/google_sheets/vicXrzONkFQqdgDU?tabId=sayfa1',
        data: [Object.values(newItem)],
      });
      message.success('Eşya eklendi');
    } catch (error) {
      console.error('Error adding data:', error.response ? error.response.data : error.message);
      message.error('An error occurred while adding data');
    }
  };

  const saveItemsToAPI = async (itemsToSave) => {
    try {
      // Clear the existing data in the API
      await axios({
        method: 'delete',
        url: 'https://v1.nocodeapi.com/esyalveree/google_sheets/vicXrzONkFQqdgDU?tabId=sayfa1',
      });

      // Save the new data to the API


      message.success('Eşyalar kaydedildi');
    } catch (error) {
      
      
    }
  };

  const handleSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDelete = async (item) => {
    try {
      setItems(items.filter((i) => i !== item));
      setMyItems(myItems.filter((i) => i !== item));
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
      message.success('Item deleted successfully');
    } catch (error) {
      message.error('An error occurred');
    }
  };

  const handleRemoveFromCart = (item) => {
    setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePayment = async () => {
    form.validateFields()
      .then(async (values) => {
        message.success('Ödeme yapıldı.Faturanız kayıtlı mail üzerine gönderilecektir.');
        form.resetFields();
        setIsModalVisible(false);
        
        try {
          await axios({
            method: 'post',
            url: 'https://v1.nocodeapi.com/esyalveree/google_sheets/vTTfqKuHCxpFPCXC?tabId=sayfa1',
            data: selectedItems.map(item => Object.values(item)),
          });
          message.success('Seçilen veriler başarıyla kaydedildi');
        } catch (error) {
          console.error('Error posting selected items:', error.response ? error.response.data : error.message);
          message.error('Kaydedilemedi');
        }
      })
      .catch(errorInfo => {
        console.error('Validate Failed:', errorInfo);
      });
  };

  const handleLogout = async () => {
    await saveItemsToAPI(items);
  };

  const showBorrowedModal = async () => {
    setBorrowedModalVisible(true);
    try {
      const response = await axios({
        method: 'get',
        url: 'https://v1.nocodeapi.com/esyalveree/google_sheets/vTTfqKuHCxpFPCXC?tabId=sayfa1',
      });

      const borrowed = response.data.data.map((item) => ({
        borrower: item.borrower,
        itemName: item.itemName,
        loanDays: item.loanDays,
        returnDate: item.returnDate,
        borrowedDate: item.borrowedDate,
      }));

      setBorrowedItems(borrowed);
    } catch (error) {
      console.error('An error occurred while fetching borrowed items:', error);
      message.error('An error occurred while fetching borrowed items');
    }
  };

  const handleBorrowedCancel = () => {
    setBorrowedModalVisible(false);
  };

  const handleFilter = () => {
    let filteredItems = borrowedItems;

    if (dateRange[0] && dateRange[1]) {
      filteredItems = filteredItems.filter(item => 
        moment(item.borrowedDate, 'GG.AA.YYYY').isBetween(dateRange[0], dateRange[1], 'days', '[]')
      );
    }

    return filteredItems;
  };

  return (
    <div>
      <Link to="/" onClick={handleLogout}>Çıkış</Link>
      <div style={{ float: 'right', marginBottom: '10px' }}>Günün Tarihi: {todayDate}</div>
      <Form layout="inline" onFinish={addItem}>
        <Form.Item label="Eşya İsmi">
          <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Ödünç alınabilir gün sayısı">
          <Input value={loanDays} onChange={(e) => setLoanDays(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Eşya Ekle
          </Button>
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ marginRight: '20px', flex: 1 }}>
          <List
            header={<div>Tüm Eşyalar</div>}
            bordered
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                Eşya İsmi:{item.itemName} - Ödünç alınabilir gün sayısı:{item.loanDays}
                <Button onClick={() => handleSelect(item)}>Seç</Button>
                <Button onClick={() => handleDelete(item)}>Sil</Button>
              </List.Item>
            )}
          />
        </div>
        <div style={{ flex: 1 }}>
          <List
            header={<div>Eşyalarım</div>}
            bordered
            dataSource={myItems}
            renderItem={(item) => (
              <List.Item>
                Eşya İsmi:{item.itemName} - Ödünç alınabilir gün sayısı:{item.loanDays} 
                <Button onClick={() => handleRemoveFromCart(item)} type="primary" danger style={{ float: 'right' }}>Kaldır</Button>
              </List.Item>
            )}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <List
          header={<div>Sepete Eklenecekler</div>}
          bordered
          dataSource={selectedItems}
          renderItem={(item) => (
            <List.Item>
              Eşya İsmi:{item.itemName} - Ödünç alınabilir gün sayısı:{item.loanDays}- Teslim Tarihi: {item.returnDate}
              <Button onClick={() => handleRemoveFromCart(item)} type="primary" danger style={{ float: 'right' }}>Kaldır</Button>
            </List.Item>
          )}
        />
        <Button style={{ marginTop: '20px', float: 'right' }} onClick={showModal}>
          Sepete Git
        </Button>
      </div>

      <Button type="primary" style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={showBorrowedModal}>
        Ödünç Alınanlar
      </Button>

      <Modal
        title="Ödünç Alınan Eşyalar"
        visible={borrowedModalVisible}
        footer={[
          <Button key="kapat" onClick={handleBorrowedCancel}>
            Kapat
          </Button>,
        ]}
        onCancel={handleBorrowedCancel}
      >
        <Form layout="inline" style={{ marginBottom: '20px' }}>
          <Form.Item label="Tarih Aralığı">
            <DatePicker.RangePicker
              format="GG.AA.YYYY"
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
            />
          </Form.Item>
        </Form>
        <List
          header={<div>Eşyalar</div>}
          bordered
          dataSource={handleFilter()}
          renderItem={(item) => (
            <List.Item>
              {item.borrower} Eşya İsmi:{item.itemName} - Ödünç alınabilir gün sayısı:{item.loanDays} - Teslim tarihi:{item.returnDate}
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title={`Ödeme Ekranı`}
        visible={isModalVisible}
        footer={[
          <Button key="kapat" onClick={handleCancel}>
            Kapat
          </Button>,
          <Button key="ödeme yap" type="primary" onClick={handlePayment}>
            Ödeme Yap
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <List
          header={<div>Sepetim - Günün Tarihi: {todayDate}</div>}
          bordered
          dataSource={selectedItems}
          renderItem={(item) => (
            <List.Item>
              Eşya İsmi:{item.itemName} - Ödünç alınabilir gün sayısı:{item.loanDays} - Teslim tarihi:{item.returnDate}
              <Button onClick={() => handleRemoveFromCart(item)} type="primary" danger style={{ float: 'right' }}>Kaldır</Button>
            </List.Item>
          )}
        />
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item
            label="İsim Soyisim"
            name="name"
            rules={[{ required: true, message: 'isim soyisim gir' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kart numarası"
            name="cardNumber"
            rules={[{ required: true, message: 'kart numarası gir' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tarih"
            name="expiryDate"
            rules={[{ required: true, message: 'tarih gir' }]}
          >
            <Input placeholder="AA/YY" />
          </Form.Item>
          <Form.Item
            label="CVV"
            name="cvv"
            rules={[{ required: true, message: ' CVV gir' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddItems;
