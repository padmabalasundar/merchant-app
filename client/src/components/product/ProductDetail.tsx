import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { getCurrencySymbol, parseDemoninations } from "../../utilities";
import { Product } from "../../types";

type RouteParams = {
  cultureCode: string;
  encodedId: string;
};

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

const ProductDetail: React.FC = () => {
  const routeParams = useParams<RouteParams>();
  const encodedId = routeParams?.encodedId?.toUpperCase();
  const cultureCode = routeParams?.cultureCode;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProduct();
  }, [encodedId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/products/${encodedId}?cultureCode=${cultureCode}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching product ${encodedId}:`, error);
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

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }
console.log('details',{product})
  return (
    <Container>
      <Card style={{margin: '20px 0px'}}>
        <img
          src={product?.media.photo}
          alt={product.name}
          style={{ height: "300px", objectFit: "contain", margin: "20px" }}
        />
        <CardContent>
          <Typography variant="h4">{product.name}</Typography>
          
          <Typography variant="h6" my={1}>Product Id: {product.id}</Typography>
          <Typography variant="body2" color="textSecondary">
            {product.description}
          </Typography>
          <Typography variant="h6" my={2}>
            {getCurrencySymbol(product.currencyCode)}{parseDemoninations(product.denominations, product.denominationType)}
          </Typography>
          
          <Typography color="textSecondary" variant="h6" my={1}>
            Terms & Conditions:
          </Typography>
          {product.translations.length ? product.translations.map((t, i) => (
             <Typography my={2} key={t.lang} textAlign={t.lang === 'ar' ? 'right' : 'left'}>
                {t.terms}
             </Typography>
          )) : product.terms ?  (
            <Typography my={2} >
               {product.terms}
            </Typography>
         ) : null}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
