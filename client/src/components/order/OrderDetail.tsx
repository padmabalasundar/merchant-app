import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { Order } from './OrderList';
import OrderComponent from "./OrderComponent";

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrder();
  },[]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/orders/${orderId}`
      );
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
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

  if (!order) {
    return <Typography variant="h6">Order not found</Typography>;
  }

    return (
        <Box>
        {order ? (<OrderComponent order={order}/>) : (<Typography variant="h6">Order not found</Typography>)
        }
        </Box>
    );
};

export default OrderDetail;
