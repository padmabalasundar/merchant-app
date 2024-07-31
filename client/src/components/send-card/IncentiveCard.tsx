import { Card, CardContent, Box, Typography } from "@mui/material";
import { Incentive } from "./SentCardList";
import moment from "moment";


type Props = {
    incentive: Incentive;
}
const IncentiveCard = (props: Props) => {
    const {incentive} = props;
    return (
        <Card style={{ minHeight: "500px", marginTop: 4 }}>
                <img
                  src={incentive.cardPhoto}
                  alt={incentive.cardName}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    margin: "20px",
                  }}
                />
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    columnGap={1}
                    mb={2}
                  >
                    <img
                      src={incentive.cardLogo}
                      alt={incentive.cardName}
                      style={{ height: "30px", objectFit: "contain" }}
                    />
                    <Typography variant="h5">{incentive.cardName}</Typography>
                  </Box>
                  <Typography my={1}>
                    Incentive Id: {incentive.incentiveId} 
                  </Typography>
                  <Typography my={1}>
                    Gift Card Id: {incentive.giftCardId} 
                  </Typography>
                  <Typography my={1}>
                    Card Price: ${incentive.cardPrice} 
                  </Typography>
                  <Typography my={1}>
                    Expiry Date: {incentive?.cardExpiryDate ? moment(incentive.cardExpiryDate).format('MM DD YYYY') : '-'} 
                  </Typography>
                  <Typography my={1}>
                    Customer Email: {incentive.customerEmail} 
                  </Typography>
                  <Typography my={1}>
                    Customer Name: {incentive.customerName} 
                  </Typography>
                  {incentive.barcodeCodes ? (<Typography my={1}>
                    Barcode Number: {incentive.barcodeCodes[0].value} 
                  </Typography>) : null}
                  {incentive.message ? (<Typography my={1}>
                    Message: {incentive.message} 
                  </Typography>) : null}
                  {incentive.deliveryScheduledAtTimestamp ? `${(moment(incentive.deliveryScheduledAtTimestamp).format('MM DD YYYY'))} UTC`  : null}
                  <Typography my={1}>
                    Status: {incentive.status} 
                  </Typography>
                </CardContent>
              </Card>
    );
};

export default IncentiveCard;