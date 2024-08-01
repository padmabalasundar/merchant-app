import React from 'react';
import {  Box, Card, CardContent, Typography,  List, ListItem, ListItemText } from '@mui/material';
// import moment from 'moment';
import { Order } from './OrderList';

type OrderComponentProps = {
    order: Order;
};

const OrderComponent = (props: OrderComponentProps) => {
    const {order} = props;
    const isUSOrder = order.cultureCode.split('-')[1] === 'US';

    return (
        <Card key={order.orderId} variant="outlined" style={{ margin: '20px 0px' }}>
          <CardContent>
            <Typography variant="h5">Order ID: {order.orderId}</Typography>
            <Typography variant="body1">Order Type: {order.orderType}</Typography>
            <Typography variant="body1">Culture Code: {order.cultureCode}</Typography>
            <Typography variant="h6" mt={1}>USD Total: ${order.baseTotal.toFixed(2)}</Typography>
            {!isUSOrder && (<Typography variant="h6" mb={1}>Converted Total: ${order.convertedTotal.toFixed(2)}</Typography>)}
            
            <Typography variant="body1">Created At: {new Date(order.createdAt).toLocaleString()}</Typography>
            <Typography variant="body1">Updated At: {new Date(order.updatedAt).toLocaleString()}</Typography>
            <Typography variant="body1" mt={1}>Status: {order.status}</Typography>

           {order.orderFailureReason && ( <Typography variant="body1" my={1}>Status: {order.orderFailureReason}</Typography>)}

            {order.items.length > 0 && (<Box mt={2}>
              <Typography variant="h6">Items:</Typography>
              {order.items.map((item, index) => (
                <Card key={index} variant="outlined" style={{ marginBottom: '10px' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                        <img src={item.photo} alt={item.name} style={{ height: '30px', objectFit: 'contain' }} />
                        <Box ml={2}>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="body1">USD Price: ${item.basePrice}</Typography>
                          {!isUSOrder && (<Typography variant="body1">Converted Price: ${item.convertedPrice}</Typography>)}
                          <Typography variant="body1">Quantity: {item.quantity}</Typography>
                          <Typography variant="body1">Description: {item.description}</Typography>
                        </Box>
                    </Box>

                    {item.recipients.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="h6">Recipients:</Typography>
                        <List>
                          {item.recipients.map((recipient, recipientIndex) => (
                            <ListItem key={recipientIndex} style={{ paddingLeft: '0' }}>
                              <ListItemText
                                primary={`${recipient.firstName} ${recipient.lastName}`}
                                secondary={
                                  <>
                                    <Typography variant="body2">Email: {recipient.email}</Typography>
                                    {/* <Typography variant="body2">Message: {recipient.message}</Typography>
                                    {recipient.deliveryScheduledAtTimestamp && (<Typography variant="body2">
                                      Delivery Scheduled At: {moment.utc(recipient.deliveryScheduledAtTimestamp).format('MMMM D, YYYY h:mm a')} UTC
                                    </Typography>)} */}
                                    {recipient?.claimLink && (<Typography variant="body2">Claim Link: <a href={recipient.claimLink} target="_blank" rel="noopener noreferrer">Claim Here</a></Typography>)}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>)}
          </CardContent>
        </Card>
    )
};

export default OrderComponent;