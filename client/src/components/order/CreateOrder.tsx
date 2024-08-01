import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cultureCode: '',
    // currencyCode: '',
    price: '',
    productId: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      cultureCode: formData.cultureCode,
      items: [
        {
          price: Number(formData.price),
          productId: formData.productId,
          recipients: [
            {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
            },
          ],
        },
      ],
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/api/order/save`, {
        ...payload
      });
      const orderResponse = response.data;
      if (orderResponse.status) {
        
        alert('Order created successfully!');
        navigate(`/buy-cards/orders`);
       
      } 
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Error processing order!`);
    } 
  };

  return (
    <Container>
    <Typography variant="h4" my={4}>Create Order</Typography>
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Culture Code"
          name="cultureCode"
          value={formData.cultureCode}
          onChange={handleChange}
          required
        />
      </Box>
      {/* <Box mb={2}>
        <TextField
          fullWidth
          label="Currency Code"
          name="currencyCode"
          value={formData.currencyCode}
          onChange={handleChange}
          required
        />
      </Box> */}
      <Box mb={2}>
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Product ID"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Recipient Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Recipient First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Recipient Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" columnGap={2} mb={2}>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={() => navigate('/buy-cards/orders')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Create Order
        </Button>
      </Box>
    </form>
  </Container>
  );
};

export default CreateOrder;
