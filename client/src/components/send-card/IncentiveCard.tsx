import { useState } from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { Incentive } from "./SentCardList";
import CommonDialog from "../common/CommonDialog";
import IncentiveRedemptions from "./IncentiveRedemptions";
import { formatDate, getCurrencySymbol } from "../../utilities";

type Props = {
  incentive: Incentive;
};
const IncentiveCard = (props: Props) => {
  const { incentive } = props;

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
        <Typography my={1}>Incentive Id: {incentive.incentiveId}</Typography>
        <Typography my={1}>Gift Card Id: {incentive.giftCardId}</Typography>
        <Typography my={1}>Card Price: {getCurrencySymbol(incentive.currencyCode)}{incentive.cardPrice}</Typography>
        <Typography my={1}>
          Expiry Date: {formatDate(incentive?.cardExpiryDate)}
        </Typography>
        <Typography my={1}>
          Customer Email: {incentive.customerEmail}
        </Typography>
        <Typography my={1}>Customer Name: {incentive.customerName}</Typography>
        {incentive.barcodeCodes ? (
          <Typography my={1}>
            Barcode Number: {incentive.barcodeCodes[0].value}
          </Typography>
        ) : null}
        {incentive.message ? (
          <Typography my={1}>Message: {incentive.message}</Typography>
        ) : null}
        {incentive.deliveryScheduledAtTimestamp ? (
          <Typography>
            Delivery Scheduled:{" "}
            {formatDate(incentive.deliveryScheduledAtTimestamp)} UTC
          </Typography>
        ) : null}
        <Typography my={2}>Status: {incentive.status}</Typography>

        {incentive.status === "SUCCESS" && (
          <Button
            variant="outlined"
            color="primary"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              openModal();
            }}
          >
            View Redemption History
          </Button>
        )}
      </CardContent>

      <CommonDialog
        open={isModalOpen}
        onClose={closeModal}
        closeText="Close"
        title="Redemption History"
        width="lg"
        CustomComponent={<IncentiveRedemptions incentive={incentive} />}
      />
    </Card>
  );
};

export default IncentiveCard;
