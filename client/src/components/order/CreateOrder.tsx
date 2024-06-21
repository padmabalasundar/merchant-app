import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, CircularProgress, Typography } from '@mui/material';
import { Order } from './OrderList';
import OrderComponent from './OrderComponent';

const ORDER_PAYLOAD = {
    items: [
      {
        price: 15,
        productId: "PANERA",
        recipients: [
          {
            email: "testcydev_2@yahoo.com",
            firstName: "Yahoo",
            lastName: "User"
          }
        ],
        // "deliveryScheduledAtTimestamp": "1718130600000",
        message: "Happy Birthday !"
      }
    ]
  };

const CreateOrder: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);

  const handleCreateOrder = async () => {
    setLoading(true);
    setMessage('');
  
    try {
      const response = await axios.post('http://localhost:5000/api/order/save', {
        ...ORDER_PAYLOAD
      });
      console.log('handleCreateOrder:', response.data);
      const orderResponse = response.data;
      if (orderResponse.status) {
        setOrder(orderResponse.data.orderSummary as Order);
        setMessage('Order created successfully!');
      } else {
        setMessage(orderResponse.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage(`An error occurred while creating the order!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom my={4}>New Order</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateOrder}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Save Order'}
      </Button>
      {message && <Typography variant="body1" color="textSecondary" mt={2}>{message}</Typography>}
      {order && (
        <OrderComponent order={order} />
      )}
    </Container>
  );
};

export default CreateOrder;
