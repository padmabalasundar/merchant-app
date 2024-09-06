import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { BarcodeCode, EmailFailureReason } from "../../types";
import IncentiveCard from "./IncentiveCard";

export type Incentive = {
  incentiveId?: number;
  giftCardId: number;
  cardName: string;
  cardPrice: number;
  currencyCode: string;
  cardPhoto: string;
  cardLogo: string;
  cardExpiryDate: Date | null;
  customerEmail: string;
  customerName: string;
  status?: "SUCCESS" | "PENDING" | "SCHEDULED" | "FAIL" | "CANCELED";
  message?: string;
  barcodeCodes?: BarcodeCode[] | null;
  failureReason?: EmailFailureReason;
  deliveryScheduledAtTimestamp?: string | null;
  deliveryAt?: string | null;
  openedAt?: string | null;
  clickedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const SentCardList = () => {
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAllSentCards();
  }, []);

  const fetchAllSentCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/gift-card/sent-cards`
      );
      setIncentives(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all sent giftcards:", error);
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
      <Box display="flex" alignItems="flex-end" justifyContent="center" m={1}>
        <Typography variant="h5" my={2}>
          Gift Cards
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        style={{ marginTop: 20, marginBottom: 20, justifyContent: "center" }}
      >
        {incentives.length ? (
          incentives.map((i) => (
            <Grid item xs={12} sm={6} lg={4} key={i.incentiveId}>
              <IncentiveCard incentive={i} />
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
              <Typography>No details available</Typography>
            </Box>
          </Container>
        )}
      </Grid>
    </Container>
  );
};

export default SentCardList;
