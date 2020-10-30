import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { toggleShowPassword, setUsername, setPassword } from '../../redux/actions/loginDialog';

const useStyles = makeStyles(theme => ({
    content: {        
        padding: 0,
        '&:first-child': {
            paddingTop: 0
        },
    },
    rightPanel: {       
        padding: theme.spacing(2), 
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(10),
        }
    },
    panelHeader: {
        paddingBottom: theme.spacing(5)
    },
    textField: {
        paddingBottom: theme.spacing(2)
    },
    link: {
        color: theme.palette.primary.main,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    logginButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.common.white
    }
}));

function LoginDialog({ username, password, isLoginOpened, loginAction, showPassword, setUsername, setPassword, toggleShowPassword })  {
    const classes = useStyles();

    function logInOnSubmit(e) {
        e.preventDefault();
        if (loginAction) {
            loginAction();
        }        
    }

    return (
        <Dialog 
            open={isLoginOpened} 
            fullWidth
            maxWidth={'sm'}
            aria-labelledby="max-width-dialog">
            <DialogContent className={classes.content}>
                <Grid container>
                    <Grid item xs={12} className={classes.rightPanel}>
                        <Typography variant="h4" color="primary" className={classes.panelHeader}>
                            Logga in
                        </Typography>
                        <form onSubmit={ logInOnSubmit }>
                            <TextField className={classes.textField}
                                autoFocus
                                fullWidth
                                name="username"
                                placeholder="Användarnamn"
                                variant="outlined"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                            <TextField className={classes.textField}
                                fullWidth
                                name="password"
                                placeholder="Lösenord"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={toggleShowPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                        </InputAdornment>
                                    ),
                                    }}
                            />                            
                            <Button className={classes.logginButton} type="submit"
                                fullWidth 
                                color="primary" 
                                variant="contained"
                                >
                                Logga in
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )    
}

const mapStateToProps = state => ({
    username: state.loginDialog.username,
    password: state.loginDialog.password,
    isLoginOpened: state.loginDialog.isLoginOpened,
    showPassword: state.loginDialog.showPassword,
    loginAction: state.loginDialog.loginAction
})

export default connect(mapStateToProps, { setUsername, setPassword, toggleShowPassword })(LoginDialog);