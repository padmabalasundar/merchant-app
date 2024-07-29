import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress } from '@mui/material';

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const FundBalance: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/fund/balance`);
      setBalance(response.data.balance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fund balance:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4">Fund Balance</Typography>
      {balance !== null ? (
        <Typography variant="h5">Balance: ${balance}</Typography>
      ) : (
        <Typography variant="h6">No balance information available</Typography>
      )}
    </Container>
  );
};

export default FundBalance;