import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1)
    },
}))

function SearchText({ className, value, onChange, onSearch }) {
    const classes = useStyles();

    function handlerEnterPress(event) {
        event.preventDefault();
        if (onSearch) {
            onSearch();
        }        
    }

    return (
        <Paper component="form" className={classes.root + ' ' + className} onSubmit={handlerEnterPress}>
            <TextField variant="outlined" fullWidth value={value} onChange={(event) => onChange(event.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => onSearch() }>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    ),
                }} />
        </Paper>
    )
}

export default SearchText;