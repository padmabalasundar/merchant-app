import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Product } from ".";
import { getCurrencySymbol, parseDemoninations } from "../../utilities";

type RouteParams = {
  cultureCode: string;
  encodedId: string;
};


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
        `http://localhost:5000/api/products/${encodedId}?cultureCode=${cultureCode}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching product ${encodedId}:`, error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

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
          <Typography variant="h6">{getCurrencySymbol(product.currencyCode)}{parseDemoninations(product.denominations, product.denominationType)}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
