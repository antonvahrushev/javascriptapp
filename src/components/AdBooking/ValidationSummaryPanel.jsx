import React, { useRef } from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { dropValidationSummaryPanelFocused } from '../../redux/actions/advert';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop:  theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    item: {
        paddingBottom: theme.spacing(2),
    },
    errorList: {
        backgroundColor: '#ffe6e6',
        borderColor: theme.palette.error.main,
        border: `1px solid`,
        borderRadius: '4px',
        padding: theme.spacing(1)
    },
    errorCaption: {
        color: '#cc0000'
    }
}))

function ValidationSummaryPanel({ advertErrors, isValidationSummaryPanelFocused, dropValidationSummaryPanelFocused })
{
    const classes = useStyles();
    const refToFocus = useRef(null);
    const scrollToRef = () => refToFocus.current.scrollIntoView();

    if (Object.keys(advertErrors).length <= 0) return null;

    let errLength = 0;
    Object.values(advertErrors).forEach(error => {
        if (typeof error === 'string') { 
            ++errLength;
            return;
        }

        if (typeof error === 'object') {
            errLength += Object.keys(error).length;
        }
    });

    if (isValidationSummaryPanelFocused) {
        setTimeout(() => {
            scrollToRef();
            dropValidationSummaryPanelFocused();
        }, 0);
    }  

    return (
        <Grid container className={classes.root} ref={refToFocus}>
            <Grid item xs={12} >
                <div className={classes.errorList}>
                    <Typography variant="h6" className={classes.errorCaption}>
                        {`Det finns ${errLength} fel i din annons`}
                    </Typography>
                    <Typography variant="body1">
                        Kontrollera fälten med röd text och ändra det som är felaktigt.<br />
                        Klicka sedan på Nästa igen.
                    </Typography>
                </div>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => ({
        advertErrors: state.advert.advertErrors,
        isValidationSummaryPanelFocused: state.advert.isValidationSummaryPanelFocused
    }
);

export default connect(mapStateToProps, { dropValidationSummaryPanelFocused })(ValidationSummaryPanel);