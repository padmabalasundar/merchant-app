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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from 'react-router-dom';
import {
  getCurrencySymbol,
  parseDemoninations,
} from "../../utilities";
import { Country } from "../country";
import { Product } from "../../types";

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const ProductList = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [countryCode, setCountry] = useState<string>("US");

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [countryCode]);

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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/products?cultureCode=en-${countryCode}`
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleCountryChange = async (event: SelectChangeEvent<string>) => {
    const key = event.target.value as Country["shortName"];
    const country = countries.find((c) => c.shortName === key) || null;
    setCountry(country?.shortName || "US");
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
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        m={1}
      >
        Select Country:
        <Select
          size="small"
          value={countryCode}
          defaultValue={countryCode}
          onChange={handleCountryChange}
        >
          {countries.sort((a,b) => a.name.localeCompare(b.name)).map((option) => (
            <MenuItem value={option.shortName} key={option.shortName}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        <Typography my={2}>
          Culture Code: en-{countryCode}
        </Typography>
      </Box>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        {products.length ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} lg={4} key={product.id} onClick={() => navigate(`/buy-cards/en-${countryCode}/products/${product.encodedId}`)}>
              <Card style={{ minHeight: "240px", marginTop: 4 }}>
                <img
                  src={product.media.photo}
                  alt={product.name}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    margin: "20px",
                  }}
                />
                <CardContent>
                  {/* <img src={product.media.logo} alt={product.name} style={{ height: '30px', objectFit: 'contain' }} /> */}
                  <Typography variant="h5" my={1}>
                    {product.name}
                  </Typography>
                  <Typography mb={2}>
                    Encoded Id: {product.encodedId}
                  </Typography>
                  
                  <Typography variant="h6" my={1}>
                    {getCurrencySymbol(product.currencyCode)}
                    {parseDemoninations(
                      product.denominations,
                      product.denominationType
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No products available</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ProductList;
