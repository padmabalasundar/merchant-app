import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import multer from 'multer';
import FormData from 'form-data';
import { Buffer } from 'buffer';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());

// Increase the limit for JSON payload
app.use(express.json({ limit: '50mb' }));

// Increase the limit for URL-encoded payload
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to handle file uploads

interface MulterFile extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  buffer: Buffer;
}

// Configurations for the API
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY; 
const API_SECRET = process.env.API_SECRET; 

const AUTH_URL = `${BASE_URL}/auth/token`;
const COUNTRIES_URL = `${BASE_URL}/countries`;
const PRODUCTS_URL = `${BASE_URL}/products`;
const FUND_BALANCE_URL = `${BASE_URL}/fund/balance`;
const FUND_ALERT_URL = `${BASE_URL}/fund/alert`;
const ORDER_URL = `${BASE_URL}/order`;


// Function to get access token
const getAccessToken = async () => {    
  // console.log('auth api:', {API_KEY, API_SECRET});
  const authResponse = await axios.post(AUTH_URL, {
    apiKey: API_KEY,
    apiSecret: API_SECRET
  });
  const response = authResponse.data;
  // console.log('auth api response:',response );

  return response.data.accessToken.token;
  
};

// fetch all supported countries
app.get('/api/countries', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const countriesResponse = await axios.get(`${COUNTRIES_URL}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    res.json(countriesResponse.data.data);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Error fetching countries', error });
  }
});

// fetch products
app.get('/api/products', async (req, res) => {
  try {
    const cultureCode = req.query.cultureCode as string;
    const accessToken = await getAccessToken();

    const productsResponse = await axios.get(`${PRODUCTS_URL}?cultureCode=${cultureCode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });

    // console.log('productsResponse:',productsResponse );
    res.json(productsResponse.data.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

//fetch product by ID
app.get('/api/products/:encodedId', async (req, res) => {
  const { encodedId } = req.params;
  try {
    const cultureCode = req.query.cultureCode as string;
    const accessToken = await getAccessToken();
    const productResponse = await axios.get(`${PRODUCTS_URL}/${encodedId}?cultureCode=${cultureCode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(productResponse.data.data);
  } catch (error) {
    console.error(`Error fetching product ${encodedId}:`, error);
    res.status(500).json({ message: `Error fetching product ${encodedId}`, error });
  }
});

//get fund balance
app.get('/api/fund/balance', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const fundsResponse = await axios.get(FUND_BALANCE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(fundsResponse.data.data);
  } catch (error) {
    console.error('Error fetching fund balance:', error);
    res.status(500).json({ message: 'Error fetching fund balance', error });
  }
});

//get fund alert threshold amount 
app.get('/api/fund/alert', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const alertResponse = await axios.get(FUND_ALERT_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(alertResponse.data.data);
  } catch (error) {
    console.error('Error fetching alert threshold amount:', error);
    res.status(500).json({ message: 'Error fetching alert threshold amount', error });
  }
});

//update fund alert threshold amount
app.put('/api/fund/alert', async (req, res) => {
  try {
    const { thresholdAmount } = req.body; 
    const accessToken = await getAccessToken();
    const setAlertResponse = await axios.put(FUND_ALERT_URL, { thresholdAmount }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(setAlertResponse.data);
  } catch (error) {
    console.error('Error setting alert amount:', error);
    res.status(500).json({ message: 'Error setting alert amount', error });
  }
});

// fetch orders
app.get('/api/orders', async (req, res) => {
  try {
    
    const accessToken = await getAccessToken();

    const orderResponse = await axios.get(ORDER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });

    res.json(orderResponse.data.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

//fetch order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const accessToken = await getAccessToken();
    const orderResponse = await axios.get(`${ORDER_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(orderResponse.data.data);
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    res.status(500).json({ message: `Error fetching order ${orderId}`, error });
  }
});


// save order
app.post('/api/order/save', async (req, res) => {
  try {
    const payload  = req.body;
    console.log('create order', {payload})
    const accessToken = await getAccessToken();
    const saveOrderResponse = await axios.post(`${ORDER_URL}/save`, { ...payload }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('save order:', {response: saveOrderResponse.data});
    res.json(saveOrderResponse.data);
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

// gift cards API endpoints

// fetch all cards 
app.get('/api/gift-card', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const giftCardResponse = await axios.get(`${BASE_URL}/gift-card`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    res.json(giftCardResponse.data.data);
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    res.status(500).json({ message: 'Error fetching gift cards', error });
  }
});

//fetch gift card by ID
app.get('/api/gift-card/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const accessToken = await getAccessToken();
    const productResponse = await axios.get(`${BASE_URL}/gift-card/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(productResponse.data.data);
  } catch (error) {
    console.error(`Error fetching gift card ${id}:`, error);
    res.status(500).json({ message: `Error fetching gift card ${id}`, error });
  }
});

// create card
app.post('/api/gift-card', upload.any(), async (req: Request, res: Response) => {
  try {
  
    const formData = new FormData();

    // Append non-file fields
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        formData.append(key, req.body[key]);
      }
    }

    // Append files
    if (req.files) {
      (req.files as MulterFile[]).forEach(file => {
        formData.append(file.fieldname, file.buffer, file.originalname);
      });
    }
    
    const accessToken = await getAccessToken();

    const response = await axios.post(`${BASE_URL}/gift-card`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...formData.getHeaders(),
      }
    });

    res.json(response.data.data);
  } catch (error: any) {
    console.error('Error creating gift card:', error);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

// update card
app.put('/api/gift-card/:id', upload.any(), async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
  
    const formData = new FormData();

    // Append non-file fields
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        formData.append(key, req.body[key]);
      }
    }

    // Append files
    if (req.files) {
      (req.files as MulterFile[]).forEach(file => {
        formData.append(file.fieldname, file.buffer, file.originalname);
      });
    }
    
    const accessToken = await getAccessToken();

    const response = await axios.put(`${BASE_URL}/gift-card/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...formData.getHeaders(),
      }
    });

    res.json(response.data.data);
  } catch (error: any) {
    console.error('Error updating gift card:', error);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});


// delete card
app.delete('/api/gift-card/:id', upload.any(), async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
      
    const accessToken = await getAccessToken();

    const response = await axios.delete(`${BASE_URL}/gift-card/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data.data);
  } catch (error: any) {
    console.error('Error deleting gift card:', error);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

// send card to customer
app.post('/api/gift-card/send', async (req, res) => {
  try {
    const payload  = req.body; 
    console.log('Send card:', {payload});
    const accessToken = await getAccessToken();
    const setAlertResponse = await axios.post(`${BASE_URL}/gift-card/send`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(setAlertResponse.data.data);
  } catch (error: any) {
    console.error('Error sending card to customer:', error);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
