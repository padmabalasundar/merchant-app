import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import axios from 'axios';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const SendGiftCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardId: '',
    cardPrice: '',
    deliveryScheduledAtTimestamp: '',
    customerEmail: '',
    customerName: '',
    customerMessage: '',
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
      cardId: Number(formData.cardId),
      cardPrice: Number(formData.cardPrice),
      deliveryScheduledAtTimestamp: formData.deliveryScheduledAtTimestamp ? Number(formData.deliveryScheduledAtTimestamp) : undefined,
      customerItems: [
        {
          email: formData.customerEmail,
          name: formData.customerName,
          message: formData.customerMessage,
        },
      ],
    };

    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/gift-card/send`, payload);
      if (response.status) {
        alert('Gift card sent to customer successfully!');
        navigate(`/create-sell/fetch-cards`);
      }
      console.log('Gift card sent:', response.data);
    } catch (error: any) {
      console.error('Error sending gift card:', error);
      alert(`Èrror! ${error.response.data.message}`);
    }
  };

  return (
    <Container>
      <Typography variant="h4" my={4}>Send Gift Card to Customer</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Gift Card ID"
            name="cardId"
            type="number"
            value={formData.cardId}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Gift Card Price"
            name="cardPrice"
            type="number"
            value={formData.cardPrice}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Customer Email"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Message"
            name="customerMessage"
            value={formData.customerMessage}
            onChange={handleChange}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Delivery Scheduled At (Timestamp in milliseconds)"
            name="deliveryScheduledAtTimestamp"
            type="number"
            value={formData.deliveryScheduledAtTimestamp}
            onChange={handleChange}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" columnGap={2} mb={2}>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => navigate('/create-sell/fetch-cards')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Send Gift Card
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default SendGiftCard;
