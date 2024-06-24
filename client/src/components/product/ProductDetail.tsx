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
import { parseDemoninations } from "../../utilities";

const ProductDetail: React.FC = () => {
  const { encodedId } = useParams<{ encodedId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const image = product?.media.faceplates[0].path;

  useEffect(() => {
    fetchProduct();
  }, [encodedId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${encodedId}`
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
          src={image}
          alt={product.name}
          style={{ height: "300px", objectFit: "contain", margin: "20px" }}
        />
        <CardContent>
          <Typography variant="h4">{product.name}</Typography>
          
          <Typography variant="h6" my={1}>Product Id: {product.id}</Typography>
          <Typography variant="body2" color="textSecondary">
            {product.description}
          </Typography>
          <Typography variant="h6">${parseDemoninations(product.denominations, product.denominationType)}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
