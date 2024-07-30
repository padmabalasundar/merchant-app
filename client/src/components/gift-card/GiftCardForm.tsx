import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, TextField, MenuItem, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import { GiftCard } from '.';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

type GiftCardDataType = Omit<GiftCard, 'id' | 'image' | 'logo' | 'createdAt' | 'updatedAt'> & {
    imageFile: File |  null;
    logoFile: File | null;
}

const GiftCardForm = () => {
  
  const navigate = useNavigate();
  const [giftCardData, setFormData] = useState<GiftCardDataType>({
    name: '',
    type: 'VARIABLE',
    cardType: 'CONSUMER',
    description: '',
    priceDenominations: [] as number[],
    expiryPeriod: 0,
    isActive: true,
    imageFile: null,
    logoFile: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...giftCardData,
      [name]: value,
    });
    
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target.name === 'imageFile') {
      setFormData({
          ...giftCardData,
          imageFile: file || null,
        });
    } else if (e.target.name === 'logoFile') {
      setFormData({
        ...giftCardData,
        logoFile: file || null,
      });
    }
  };

  const handlePriceDenominationsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData({
      ...giftCardData,
      priceDenominations: value.split(',').map(Number),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {imageFile, logoFile, ...others} = giftCardData;
    const payload = JSON.stringify(others);

    const formData = new FormData();
    formData.append('formData', payload);

    if (giftCardData.imageFile) {
      formData.append('imageFile', giftCardData.imageFile);
    }
    if (giftCardData.logoFile) {
      formData.append('logoFile', giftCardData.logoFile);
    }

    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/gift-card`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      if ( response.status)
      {
        alert('Gift card created successfully!');
        navigate(`/create-sell/fetch-cards`)
      }
      console.log('Gift card created:', response.data);

    } catch (error) {
      console.error('Error creating gift card:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" my={4}>Create Gift Card</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={giftCardData.name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={giftCardData.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="VARIABLE">VARIABLE</MenuItem>
            <MenuItem value="FIXED">FIXED</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            fullWidth
            label="Card Type"
            name="cardType"
            value={giftCardData.cardType}
            onChange={handleChange}
            required
          >
            <MenuItem value="CONSUMER">CONSUMER</MenuItem>
            <MenuItem value="COMMERCIAL">COMMERCIAL</MenuItem>
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={giftCardData.description}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Price Denominations (comma separated)"
            name="priceDenominations"
            value={giftCardData.priceDenominations.join(',')}
            onChange={handlePriceDenominationsChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Expiry Period (in months)"
            name="expiryPeriod"
            type="number"
            value={giftCardData.expiryPeriod}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
            <label htmlFor="imageFile" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Choose Image
            </label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </Box>
        <Box mb={2}>
            <label htmlFor="logoFile" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Choose Logo
            </label>
          <input
            type="file"
            name="logoFile"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </Box>
        <Box mb={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Create Gift Card
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default GiftCardForm;
