import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type ConfirmModalProps = {
    open: boolean;
    title: string;
    width: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    confirmText?: string;
    closeText?: string;
    description?: string;
    CustomComponent?: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
};

const CommonDialog = (props: ConfirmModalProps) => {
    const { open, title, width, confirmText, closeText, CustomComponent, description, onClose, onConfirm } = props;
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={width}
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                {CustomComponent ? (
                CustomComponent
                ) : (
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {closeText || 'Cancel'}
                </Button>
                {onConfirm && (<Button variant="contained" onClick={onConfirm} color="primary" autoFocus>
                    {confirmText || 'Confirm'}
                </Button>)}
            </DialogActions>
        </Dialog>
    );
};

export default CommonDialog;
