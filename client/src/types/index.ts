
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