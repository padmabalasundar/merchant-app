import { Router, Request, Response } from "express";
import axios from "axios";
import multer from "multer";
import { Buffer } from 'buffer';
import FormData from 'form-data';
import { BASE_URL, getAccessToken } from ".";

const router = Router({ mergeParams: true });

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to handle file uploads

interface MulterFile extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  buffer: Buffer;
}

router.get('/', async (req, res) => {
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
  router.get('/:id', async (req, res) => {
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
  router.post('/', upload.any(), async (req: Request, res: Response) => {
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
  router.put('/:id', upload.any(), async (req: Request, res: Response) => {
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
  router.delete('/:id', upload.any(), async (req: Request, res: Response) => {
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
  router.post('/send', async (req, res) => {
    try {
      const payload  = req.body; 
      console.log('Send card:', {payload});
      const accessToken = await getAccessToken();
      const response = await axios.post(`${BASE_URL}/gift-card/send`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data.status) {
        res.json(response.data.data);
      }
    } catch (error: any) {
      console.error('Error sending card to customer:', error);
      if (error.status === 400) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  });
  
  // fetch all sent incentive cards 
  router.get('/sent-cards', async (req, res) => {
    try {
      const accessToken = await getAccessToken();
  
      const response = await axios.get(`${BASE_URL}/gift-card/sent-cards`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      res.json(response.data.data);
    } catch (error: any) {
      console.error('Error fetching sent-cards:', error);
      if (error.status === 400) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  });
  
  // validate sent card by barcodeNumber
  router.post('/validate', async (req, res) => {
    try {
      const payload  = req.body; 
      console.log('Validate card:', {payload});
      const accessToken = await getAccessToken();
      const response = await axios.post(`${BASE_URL}/gift-card/validate`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Validate incentive card:', response);
      
      if (!response.data.status) {
        res.status(500).json({ status: false, message: response.data.message });
      }
      res.json(response.data.data);
      
    } catch (error: any) {
      console.error('Error sending card to customer:', error);
      if (error.status === 400) {
        res.status(400).json({ status: false, message: error.message });
        return;
      }
      res.status(500).json({ status: false, message: error.message });
    }
  });
  
  // validate sent card by barcodeNumber
  router.post('/redeem', async (req, res) => {
    try {
      const payload  = req.body; 
      console.log('Redeem card:', {payload});
      const accessToken = await getAccessToken();
      const response = await axios.post(`${BASE_URL}/gift-card/redeem`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Redeem card response:', response);
      
      if (!response.data.status) {
        res.status(500).json({ status: false, message: response.data.message });
      }
      res.json(response.data.data);
      
    } catch (error: any) {
      console.error('Error sending card to customer:', error);
      if (error.status === 400) {
        res.status(400).json({ status: false, message: error.message });
        return;
      }
      res.status(500).json({ status: false, message: error.message });
    }
  });
  
  
  // fetch all redemptions by incentive id
  router.get('/redemptions/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const accessToken = await getAccessToken();
  
      const incentivesResponse = await axios.get(`${BASE_URL}/gift-card/redemptions/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });
      res.json(incentivesResponse.data.data);
    } catch (error: any) {
      console.error('Error fetching all sent cards:', error);
      if (error.status === 400) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  });


  export default router;