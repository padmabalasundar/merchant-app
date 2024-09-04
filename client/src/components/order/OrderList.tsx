import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import OrderComponent from './OrderComponent';

export type Recipient = {
    email: string;
    firstName: string;
    lastName: string;
    claimLink: string;
    // message: string;
    // deliveryScheduledAtTimestamp: string;
  }

  export type OrderItem = {
    name: string;
    basePrice: string;
    convertedPrice: string;
    productId: string;
    quantity: string;
    description: string;
    photo: string;
    // logo: string;
    recipients: Recipient[];
  }
  
  export type Order = {
    createdAt: string; // ISO date string
    items: OrderItem[];
    orderId: number;
    status: "PENDING" | "COMPLETED" | "CANCELED" | 'SCHEDULED' | 'FAIL';
    orderFailureReason: 'GIFT_CARD_ORDER_FAILURE' |
    'PAYMENT_FAILURE' |
    'FRAUD' |
    'INTERNAL_FAILURE';
    orderType: 'GIFT_CARD_PURCHASE' | 'GIFT_CARD_PURCHASE_WITH_API' | 'SUBSCRIPTION' | 'CARDMOOLA_FUNDS';
    baseTotal: number;
    convertedTotal: number;
    convertedCurrency: string;
    cultureCode: string; // en-US
    updatedAt: string; // ISO date string
  }

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;
  
const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/orders`);
      const orders = response.data as Order[];
      const sortedOrders = orders.sort((a,b) => b.orderId - a.orderId);
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (<Container>
      <Box display="flex" justifyContent="center" alignItems="center" my={10}>
        <CircularProgress />;
      </Box>
      </Container>)
  }

  if (!orders || orders.length === 0) {
    return <Typography variant="h6">No orders available</Typography>;
  }

  return (
    <Container>
     {orders.map((order) => (
        <Box key={order.orderId}>
            <OrderComponent order={order} />
        </Box>
      ))}
    </Container>
  );
};

export default OrderList;
