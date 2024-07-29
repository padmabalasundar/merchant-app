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
  MenuItem,
} from "@mui/material";

export type Country = {
    shortName: string;
    name: string;
    currency: string;
    languages: string[];
};

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const CountryList = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/countries`
      );
      setCountries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching countries:", error);
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
      
        <Typography variant="h5" my={2}>
          CardMoola Supported Countries
        </Typography>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        {countries.length ? (
          countries.map((country) => (
            <Grid item xs={12} sm={6} lg={4} key={country.shortName}>
              <Card style={{ minHeight: "240px", marginTop: 4 }}>
                
                <CardContent>
                  <Typography variant="h5" my={2}>
                    {country.name}
                  </Typography>
                  <Typography mb={2}>
                    Country code: {country.shortName}
                  </Typography>
                  <Typography mb={2}>
                    Currency Code: {country.currency}
                  </Typography>
                  <Typography mb={2}>
                    Languages: {country.languages.toString()}
                  </Typography>
                  
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No countries available</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default CountryList;
