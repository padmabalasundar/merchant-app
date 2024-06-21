import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Typography, TextField, CircularProgress, Box } from '@mui/material';

const FundManagement: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [alertAmount, setAlertAmount] = useState<number | null>(null);
  const [inputAlertAmount, setInputAlertAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleFetchBalance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/fund/balance');
      setBalance(response.data.balance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fund balance:', error);
      setMessage('Error fetching fund balance');
      setLoading(false);
    }
  };

  const handleFetchAlertAmount = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/fund/alert');
      setAlertAmount(response.data.thresholdAmount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alert amount:', error);
      setMessage('Error fetching alert amount');
      setLoading(false);
    }
  };

  const handleSetAlertAmount = async () => {
    setLoading(true);
    try {
      const response = await axios.put('http://localhost:5000/api/fund/alert', { thresholdAmount: parseFloat(inputAlertAmount) });
      if (!response.data.status) {
        setMessage('Error setting alert amount');
        setLoading(false);
        return;
      }
      setMessage(`Alert amount set to: $${inputAlertAmount}`);
      setLoading(false);
    } catch (error) {
      console.error('Error setting alert amount:', error);
      setMessage('Error setting alert amount');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Fund Management</Typography>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleFetchBalance}>Fund Balance</Button>
      </Box>
      {loading && <CircularProgress />}
      {balance !== null && <Typography variant="h6">Balance: ${balance}</Typography>}

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleFetchAlertAmount}>Get Alert Amount</Button>
      </Box>
      {alertAmount !== null && <Typography variant="h6">Alert Amount: ${alertAmount}</Typography>}

      <Box mt={2}>
        <TextField
          label="Set Alert Amount"
          variant="outlined"
          fullWidth
          value={inputAlertAmount}
          onChange={(e) => setInputAlertAmount(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSetAlertAmount} disabled={loading || !inputAlertAmount} style={{marginTop: '20px'}}>
          Set Alert Amount
        </Button>
      </Box>
      {message && <Typography variant="body1" color="secondary">{message}</Typography>}
    </Container>
  );
};

export default FundManagement;
