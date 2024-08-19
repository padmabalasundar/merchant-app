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
import GiftCardList from './components/gift-card';
import GiftCardForm from './components/gift-card/GiftCardForm';
import SendGiftCard from './components/send-card';
import SentCardList from './components/send-card/SentCardList';
import RedeemCard from './components/send-card/RedeemCard';

type WelcomeProps = {
    onSelectOption: (option: string) => void
}

const Welcome = (props: WelcomeProps) => {
    const {onSelectOption} = props;
    const navigate = useNavigate();
  
    return (
      <Box my={4}>
        <Typography variant="h4" mb={2}>Welcome!</Typography>
        <Button variant="contained" color="primary" onClick={() => { onSelectOption('buy-cards'); navigate('/buy-cards/countries'); }}>Buy Bulk</Button>
        <Button variant="contained" color="secondary" onClick={() => { onSelectOption('create-sell'); navigate('/create-sell/fetch-cards'); }} style={{ marginLeft: 10 }}>Create & Sell Custom Cards</Button>
      </Box>
    );
  };
  
  const BuyBulkRoutes = () => (
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
  
  const CreateSellRoutes = () => (
    <Routes>
      <Route path="/fetch-cards" element={<GiftCardList />} />
      <Route path="/gift-card/:id" element={<GiftCardForm />} />
      <Route path="/create-card" element={<GiftCardForm />} />
      <Route path="/send-to-customer" element={<SendGiftCard />} />
      <Route path="/view-incentives" element={<SentCardList />} />
      <Route path="/redeem" element={<RedeemCard />} />
    </Routes>
  );


  const MainApp = () => {
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

    const renderMenuItem = (link: string, name: string) => (
      <Button color="inherit" style={{fontSize: 12}} component={Link} to={link}>{name}</Button>
    )
  
    const renderToolbarButtons = () => {
        switch(selectedOption) {
            case 'buy-cards': {
                return (
                <>
                  {renderMenuItem('/buy-cards/countries','Countries')}
                  {renderMenuItem('/buy-cards/products','Products')}
                  {renderMenuItem('/buy-cards/funds','Funds')}
                  {renderMenuItem('/buy-cards/orders','Orders')}
                  {renderMenuItem('/buy-cards/orders/save','Create Order')}
                </>
                );
            } 
            case 'create-sell': {
                return (
                <>
                  {renderMenuItem('/create-sell/fetch-cards','Fetch Cards')}
                  {renderMenuItem('/create-sell/create-card','Create Card')}
                  {renderMenuItem('/create-sell/send-to-customer','Send Card')}
                  {renderMenuItem('/create-sell/view-incentives','Sent Cards')}
                  {renderMenuItem('/create-sell/redeem','Redeem Card')}
                </>
                );
            }
            default:
                return null;
        }
    };
  
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            {renderMenuItem('/','Home')}
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