import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Container,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import axios from "axios";
import { GiftCard } from ".";
import { getCurrencySymbol } from "../../utilities";

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

type GiftCardDataType = Omit<
  GiftCard,
  "id" | "image" | "logo" | "createdAt" | "updatedAt"
> & {
  imageFile: File | null;
  logoFile: File | null;
  id?: string | null;
};

type RouteParams = {
  id: string;
};

const DEFAULT_DATA: GiftCardDataType = {
  name: "",
  type: "VARIABLE",
  cardType: "CONSUMER",
  description: "",
  priceDenominations: [] as number[],
  currencyCode: "USD",
  expiryPeriod: 0,
  isActive: true,
  imageFile: null,
  logoFile: null,
}

const GiftCardForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const routeParams = useParams<RouteParams>();
  const id = routeParams?.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [giftCardData, setFormData] = useState<GiftCardDataType>(DEFAULT_DATA);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if(pathname === '/create-sell/create-card') init();
  },[pathname]);

  useEffect(() => {
    if (id) getGiftCard(id);
  }, [id]);

  const init = () => {
    setFormData(DEFAULT_DATA);
    setImagePreview(null);
    setLogoPreview(null);
  }

  const getGiftCard = async (id: string) => {
    setLoading(true);
    const response = await axios.get(`${SERVER_BASE_URL}/api/gift-card/${id}`);
    const giftCard = response.data as GiftCard;
    setFormData({ ...giftCard, imageFile: null, logoFile: null });
    if (giftCard.image) {
      setImagePreview(giftCard.image);
    }
    if (giftCard.logo) {
      setLogoPreview(giftCard.logo);
    }
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...giftCardData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target.name === "imageFile") {
      setFormData({
        ...giftCardData,
        imageFile: file || null,
      });
    } else if (e.target.name === "logoFile") {
      setFormData({
        ...giftCardData,
        logoFile: file || null,
      });
    }
  };

  const handlePriceDenominationsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData({
      ...giftCardData,
      priceDenominations: value.split(",").map(Number),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { imageFile, logoFile, ...others } = giftCardData;
    const payload = JSON.stringify(others);

    const formData = new FormData();
    formData.append("formData", payload);

    if (giftCardData.imageFile) {
      formData.append("imageFile", giftCardData.imageFile);
    }
    if (giftCardData.logoFile) {
      formData.append("logoFile", giftCardData.logoFile);
    }

    if (giftCardData.id) {
        makeRequest(`${SERVER_BASE_URL}/api/gift-card/${giftCardData.id}`, formData, 'put');
    } else {
        makeRequest(`${SERVER_BASE_URL}/api/gift-card`, formData, 'post');
    }
    
  };

  const makeRequest = async (url: string, formData: FormData, method: 'post' | 'put') => {
    try {
        setLoading(true);
        const response = await axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status) {
            alert(`Gift card ${method === 'post' ? 'created' : 'updated'} successfully!`);
            navigate(`/create-sell/fetch-cards`);
        }
        console.log(`Gift card ${method === 'post' ? 'created' : 'updated'}:`, response.data);
    } catch (error) {
        console.error(`Error ${method === 'post' ? 'creating' : 'updating'} gift card:`, error);
    } finally {
        setLoading(false);
    }
};

  // if (loading) {
  //   return (
  //     <Container>
  //       <Box display="flex" justifyContent="center" alignItems="center" my={10}>
  //         <CircularProgress />;
  //       </Box>
  //     </Container>
  //   );
  // }

  return (
    <Container>
      <Typography variant="h4" my={4}>
        {giftCardData?.id ? "Update " : "Create "} Gift Card
      </Typography>
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
        <Box display="flex" justifyContent="space-between" columnGap={1} mb={2}>
          <TextField
            fullWidth
            label="Currency Code"
            name="currencyCode"
            disabled={Boolean(giftCardData?.id)}
            value={giftCardData.currencyCode}
            onChange={handleChange}
            required
          />
          
          <TextField
            fullWidth
            label="Price Denominations (comma separated)"
            name="priceDenominations"
            value={giftCardData.priceDenominations.join(",")}
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
            <FormControlLabel
                control={
                    <Switch
                        checked={giftCardData.isActive}
                        onChange={handleChange}
                        name="isActive"
                        color="primary"
                    />
                }
                label="Active"
            />
        </Box>
        <Box mb={2}>
          <Typography>
            {giftCardData?.id ? "Change " : "Upload "} Gift Card Image
          </Typography>
          {imagePreview && (
            <Box mb={2}>
              <img
                src={imagePreview}
                alt="card-img"
                style={{ height: "60px", objectFit: "contain" }}
              />
            </Box>
          )}
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            required={id ? false : true}
          />
        </Box>
        <Box mb={2}>
          <Typography>
            {giftCardData?.id ? "Change " : "Upload "} Gift Card Logo
          </Typography>
          {logoPreview && (
            <Box mb={2}>
              <img
                src={logoPreview}
                alt="card-logo"
                style={{ height: "40px", objectFit: "contain" }}
              />
            </Box>
          )}
          <input
            type="file"
            name="logoFile"
            accept="image/*"
            onChange={handleFileChange}
            required={id ? false : true}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" columnGap={2} mb={2}>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            disabled={loading}
            onClick={() => navigate("/create-sell/fetch-cards")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading && <CircularProgress className="button-loader" />}&nbsp;{id ? "Update" : "Create"} Gift Card
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default GiftCardForm;
