import { useEffect, useState } from "react";
import TableComponent from "../common/TableComponent";
import { IncentiveRedemption, SERVER_BASE_URL } from "../../types";
import { Incentive } from "./SentCardList";
import axios from "axios";
import { Container, Box, CircularProgress } from "@mui/material";

const columns = [
    { id: 'incentiveId', label: 'Incentive ID' },
    { id: 'id', label: 'ID' },
    { id: 'redeemedAt', label: 'Redeemed At' },
    { id: 'amount', label: 'Amount' },
    { id: 'totalExpenditure', label: 'Total Expenditure' },
    { id: 'balance', label: 'Balance' },
    { id: 'notes', label: 'Notes' },
    { id: 'platformType', label: 'Platform Type' },
  ];

  type Props = {
    incentive: Incentive | null;
  }

  const IncentiveRedemptions = (props: Props) => {
    const {incentive} = props;

    const [redemptions, setRedemptions] = useState<IncentiveRedemption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if(incentive) fetchRedemptions();
    },[incentive]);

    const fetchRedemptions = async () => {
        try{
            setLoading(true);
            const response = await axios.get(`${SERVER_BASE_URL}/api/gift-card/redemptions/${incentive?.incentiveId}`);
            const redemptions = (response.data as IncentiveRedemption[] || []).map((r) => ({...r, amount: r.amount / 100, totalExpenditure: r.totalExpenditure / 100 }))
            setRedemptions(redemptions);
            setLoading(false);
        }catch(e: any) {
            setLoading(false);
            console.log('Error while fetching redemptions:', e.message);
        }
    }
    if (loading) {
        return (<Container>
          <Box display="flex" justifyContent="center" alignItems="center" my={10}>
            <CircularProgress />;
          </Box>
          </Container>)
      }
    
    return (
        <TableComponent columns={columns} data={redemptions} />
    )
  };

  export default IncentiveRedemptions;