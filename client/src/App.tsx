import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar, Button } from '@mui/material';
import ProductList from './components/product';
import ProductDetail from './components/product/ProductDetail';
import FundManagement from './components/fund';
import OrderList from './components/order/OrderList';
import CreateOrder from './components/order/CreateOrder';
import OrderDetail from './components/order/OrderDetail';
import CountryList from './components/country';


const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/countries">Countries</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/funds">Funds</Button>
          <Button color="inherit" component={Link} to="/orders">Orders</Button>
          <Button color="inherit" component={Link} to="/orders/save">Create Order</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Typography variant="h4" my={4}>Welcome!</Typography>} />
          <Route path="/countries" element={<CountryList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/:cultureCode/products/:encodedId" element={<ProductDetail />} />
          <Route path="/funds" element={<FundManagement />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/orders/save" element={<CreateOrder />} />
        </Routes>
      </Container>
    </Router>
  );
};


export default App;
