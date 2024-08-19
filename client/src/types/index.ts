
export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

export interface BounceReason {
    type: 'Undetermined' | 'Permanent' | 'Transient';
    subType:
        | 'Undetermined'
        | 'General'
        | 'NoEmail'
        | 'Suppressed'
        | 'OnAccountSuppressionList'
        | 'MailboxFull'
        | 'MessageTooLarge'
        | 'ContentRejected'
        | 'AttachmentRejected';
}

export interface ComplaintReason {
    type: 'OnAccountSuppressionList' | null;
    subType: 'abuse' | 'auth-failure' | 'fraud' | 'not-spam' | 'other' | 'virus';
}

export type EmailFailureReason = {
    bounce?: BounceReason;
    complaint?: ComplaintReason;
};

export type BarcodeCode = {
    /**
     * Label for the code provided.
     */
    label: string;
    /**
     * Code value.
     */
    value: string;
};

export type IncentiveRedemption = {
    incentiveId: number;
    id:	number;
    amount:	number;
    totalExpenditure:	number;
    balance:	number;
    platformType:	 string;
    redeemedAt:	string;
    notes?:	string;
}

export type Product = {
    id: number;
    encodedId: string;
    cultureCode: string[];
    currencyCode: string;
    denominationType: string;
    denominations: number[];
    media: {
      logo: string;
      photo: string;
    };
    name: string;
    description: string;
    translations: [
      {
          lang: string;
          terms: string;
      }
    ]
  };
  