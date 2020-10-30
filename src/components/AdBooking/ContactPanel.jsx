import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { changeName, changeEmail, changePhone } from '../../redux/actions/advert';


const useStyles = makeStyles(theme => ({
    root: {
        paddingTop:  theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    item: {
        paddingBottom: theme.spacing(2),
    }
}))

function ContactPanel({ 
    name,
    email,
    phone,
    advertErrors,
    changeName, 
    changeEmail, 
    changePhone,
})
{
    const classes = useStyles();
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} >
                <Typography variant="h6" className={classes.item}>
                    Kontaktuppgifter
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField className={classes.item}
                    fullWidth
                    variant="outlined"
                    error={!!advertErrors.advertiserName}
                    helperText={advertErrors.advertiserName}
                    label="Namn"
                    value={name} 
                    onChange={(event) => changeName(event.target.value)} />
                <TextField className={classes.item}
                    error={!!advertErrors.advertiserEmail}
                    helperText={advertErrors.advertiserEmail}
                    fullWidth
                    variant="outlined"
                    type="email"
                    label="E-post"
                    value={email}
                    onChange={(event) => changeEmail(event.target.value)} />
                <TextField 
                    error={!!advertErrors.advertiserPhone}
                    helperText={advertErrors.advertiserPhone}
                    fullWidth
                    variant="outlined"
                    label="Telefon"
                    type="tel"
                    value={phone}
                    onChange={(event) => changePhone(event.target.value)} />
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => {
    return {
        name: state.advert.advertiserName  || '',
        email: state.advert.advertiserEmail || '',
        phone: state.advert.advertiserPhone || '',
        advertErrors: state.advert.advertErrors
    }
};

export default connect(mapStateToProps, { changeName, changeEmail, changePhone })(ContactPanel);