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
import { Country } from "../country";

export type Category = {
    name: string;
    key: string;
    productIds: string[];
};

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const Categories = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countryCode, setCountry] = useState<string>("US");
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [countryCode]); const fetchCountries = async () => {
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/products/get-categories?countryCode=${countryCode}`
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      
        <Typography variant="h5" my={2}>
          CardMoola Supported Catgegories
        </Typography>
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
          Country Code: {countryCode}
        </Typography>
      </Box>
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        {categories.length ? (
          categories.map((category) =>{
            return (
            <Grid item xs={12} sm={6} lg={4} key={category.key}>
              <Card style={{ minHeight: "240px", marginTop: 4 }}>
                
                <CardContent>
                  <Typography mb={2}>
                    Category name: {category.name}
                  </Typography>
                  <Typography mb={2}>
                    Category key: {category.key}
                  </Typography>
                  <Typography mb={2} noWrap={false}>
                    Product Ids: {category.productIds.map(p => (<Typography>
                    {p}
                  </Typography>))}
                  </Typography>
                  
                </CardContent>
              </Card>
            </Grid>
          )})
        ) : (
          <Typography>No categories available</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Categories;
