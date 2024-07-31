import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { parseDemoninations } from "../../utilities";

export type GiftCard = {
  id: string;
  name: string;
  type: "VARIABLE" | "FIXED";
  cardType: "CONSUMER" | "COMMERCIAL";
  description: string;
  image: string;
  logo: string;
  priceDenominations: number[];
  expiryPeriod: number; // in months
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const GiftCardList = () => {
  const navigate = useNavigate();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_BASE_URL}/api/gift-card`);
      setGiftCards(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching giftcards:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" my={10}>
          <CircularProgress />;
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        m={1}
      >
        <Typography variant="h5" my={2}>Gift Cards</Typography>
      </Box>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        {giftCards.length ? (
          giftCards.map((c) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={c.id}
              onClick={() => navigate(`/create-sell/gift-card/${c.id}`)}
            >
              <Card style={{ minHeight: "500px", marginTop: 4 }}>
                <img
                  src={c.image}
                  alt={c.name}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    margin: "20px",
                  }}
                />
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    columnGap={1}
                    mb={2}
                  >
                    <img
                      src={c.logo}
                      alt={c.name}
                      style={{ height: "30px", objectFit: "contain" }}
                    />
                    <Typography variant="h5">{c.name}</Typography>
                  </Box>
                  <Typography my={1}>
                    Gift ard Id: {c.id} 
                  </Typography>
                  <Typography mb={1}>
                    Expiry: {c.cardType === 'CONSUMER' ? `${c.expiryPeriod / 12}  years` : `${c.expiryPeriod} months`} 
                  </Typography>
                  <Typography mb={1}>Card Type: {c.cardType}</Typography>

                  <Typography mb={1}>
                    Status: {c.isActive ? "Active" : "Inactive"}
                  </Typography>
                  <Typography variant="h6" my={1}>
                    ${parseDemoninations(c.priceDenominations, c.type)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    {c.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Container>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              my={10}
            >
              <Typography>No gift cards available</Typography>
            </Box>
          </Container>
        )}
      </Grid>
    </Container>
  );
};

export default GiftCardList;