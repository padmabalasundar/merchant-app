import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Box } from '@mui/material'
import ProductList from './components/product';
import ProductDetail from './components/product/ProductDetail';
import FundManagement from './components/fund';
import OrderList from './components/order/OrderList';
import CreateOrder from './components/order/CreateOrder';
import OrderDetail from './components/order/OrderDetail';
import CountryList from './components/country';


const Welcome: React.FC<{ onSelectOption: (option: string) => void }> = ({ onSelectOption }) => {
    const navigate = useNavigate();
  
    return (
      <Box my={4}>
        <Typography variant="h4" mb={2}>Welcome!</Typography>
        <Button variant="contained" color="primary" onClick={() => { onSelectOption('buy-cards'); navigate('/buy-cards/countries'); }}>Buy Bulk</Button>
        <Button variant="contained" color="secondary" onClick={() => { onSelectOption('create-sell'); navigate('/create-sell/fetch-cards'); }} style={{ marginLeft: 10 }}>Create & Sell Custom Cards</Button>
      </Box>
    );
  };
  
  const BuyBulkRoutes: React.FC = () => (
    <Routes>
      <Route path="/countries" element={<CountryList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/:cultureCode/products/:encodedId" element={<ProductDetail />} />
      <Route path="/funds" element={<FundManagement />} />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orders/:orderId" element={<OrderDetail />} />
      <Route path="/orders/save" element={<CreateOrder />} />
    </Routes>
  );
  
  const CreateSellRoutes: React.FC = () => (
    <Routes>
      <Route path="/fetch-cards" element={<CountryList />} />
      <Route path="/create-cards" element={<CountryList />} />
      <Route path="/send-to-customer" element={<CountryList />} />
      <Route path="/redeem" element={<CountryList />} />
      <Route path="/view-redemption/:cardId" element={<CountryList />} />
    </Routes>
  );


  const MainApp: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const location = useLocation();
  
    useEffect(() => {
      if (location.pathname.startsWith('/buy-cards')) {
        setSelectedOption('buy-cards');
      } else if (location.pathname.startsWith('/create-sell')) {
        setSelectedOption('create-sell');
      } else {
        setSelectedOption(null);
      }
    }, [location.pathname]);
  
    const renderToolbarButtons = () => {
      if (selectedOption === 'buy-cards') {
        return (
          <>
            <Button color="inherit" component={Link} to="/buy-cards/countries">Countries</Button>
            <Button color="inherit" component={Link} to="/buy-cards/products">Products</Button>
            <Button color="inherit" component={Link} to="/buy-cards/funds">Funds</Button>
            <Button color="inherit" component={Link} to="/buy-cards/orders">Orders</Button>
            <Button color="inherit" component={Link} to="/buy-cards/orders/save">Create Order</Button>
          </>
        );
      } else if (selectedOption === 'create-sell') {
        return (
          <>
            <Button color="inherit" component={Link} to="/create-sell/fetch-cards">Fetch Cards</Button>
            <Button color="inherit" component={Link} to="/create-sell/create-cards">Create Cards</Button>
            <Button color="inherit" component={Link} to="/create-sell/send-to-customer">Send to Customer</Button>
            <Button color="inherit" component={Link} to="/create-sell/redeem">Redeem</Button>
            <Button color="inherit" component={Link} to="/create-sell/view-redemption/:cardId">View Redemption</Button>
          </>
        );
      }
      return null;
    };
  
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">Home</Button>
            {renderToolbarButtons()}
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<Welcome onSelectOption={setSelectedOption} />} />
            <Route path="/buy-cards/*" element={<BuyBulkRoutes />} />
            <Route path="/create-sell/*" element={<CreateSellRoutes />} />
          </Routes>
        </Container>
      </>
    );
  };

  export default MainApp;