import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
};

const ConfirmDialog = (props: ConfirmModalProps) => {
    const { open, onClose, onConfirm, title, description } = props;
    return (
        <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {description}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
            Cancel
            </Button>
            <Button variant="contained" onClick={onConfirm} color="primary" autoFocus>
            Delete
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
