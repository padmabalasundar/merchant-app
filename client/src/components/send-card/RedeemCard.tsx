import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const RedeemCard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    barcodeNumber: "",
    pin: "",
    amount: "",
    notes: "",
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
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/gift-card/redeem`,
        formData
      );
      if (response.status === 200) {
        setLoading(false);
        alert("Card redeemed successfully!");
        navigate("/create-sell/view-incentives");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error redeeming card:", error);
      alert(`Error! ${error.response.data.message}`);
    }
  };

  const validateCard = async(barcodeNumber: string) => {
    if (!barcodeNumber) return;
    setLoading(true);
    try {
        const response = await axios.post(`${SERVER_BASE_URL}/api/gift-card/validate`, { giftCardNumber: barcodeNumber});
        
        if (response.status) {
          setLoading(false);
          alert('Bardcode number is Valid!');
        }
        console.log('Incentive details:', response.data);
      } catch (error: any) {
        setLoading(false);
        console.error("Error validating sent card:", error);
        alert(`${error.response.data.message}`);
      }
  }

  return (
    <Container>
      <Typography variant="h4" my={4}>
        Redeem Card
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container mb={2} gap={1} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="Barcode Number"
              name="barcodeNumber"
              value={formData.barcodeNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={async(e: React.MouseEvent) => {
                e.stopPropagation();
                await validateCard(formData.barcodeNumber);
              }}
            >
              {loading && <CircularProgress />}&nbsp;Validate Card
            </Button>
          </Grid>
        </Grid>

        <Box mb={2}>
          <TextField
            fullWidth
            label="PIN"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
            inputProps={{ step: "0.01" }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" columnGap={2} mb={2}>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => navigate("/create-sell/view-incentives")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading && <CircularProgress />}&nbsp;Redeem Card
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default RedeemCard;
