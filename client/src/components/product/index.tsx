import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { parseDemoninations } from '../../utilities';

export type Product = {
  id: number;
  encodedId: string;
  denominationType: string;
  denominations: number[];
  media: {
    logo: string;
    faceplates: [
      {
        name: string;
        path: string;
      }
    ]
  }
  name: string;
  description: string;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (<Container>
      <Box display="flex" justifyContent="center" alignItems="center" my={10}>
        <CircularProgress />;
      </Box>
      </Container>)
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card  style={{ minHeight: '700px', marginTop: 4 }}>
              <img src={product.media.faceplates[0].path} alt={product.name} style={{ height: '200px', objectFit: 'contain', margin: "20px" }} />
              <CardContent>
                <img src={product.media.logo} alt={product.name} style={{ height: '30px', objectFit: 'contain' }} />
                <Typography variant="h5" my={2}>{product.name}</Typography>

                <Typography mb={2}>Encoded Id: {product.encodedId}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" my={1}>${parseDemoninations(product.denominations, product.denominationType)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
