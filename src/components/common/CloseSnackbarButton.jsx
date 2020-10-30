import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function({ closeSnackbar }) {
    return (key) => (
            <IconButton key="close" aria-label="Close" color="inherit" onClick={() => { closeSnackbar(key) }}>
                <CloseIcon />
            </IconButton>
    )
}