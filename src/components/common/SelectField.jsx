import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
    select: {
        '&.Mui-disabled.Mui-error fieldset': {
            borderColor: 'red',
        },    
    }
}));

function SelectField({ className, items, value, onChange, error, label }) {
    const classes = useStyles();

    return (
        <FormControl className={className}
            disabled={!(items && (items.length > 0))}
            error={!!error}
            variant="outlined" 
            fullWidth >
            <InputLabel>{label}</InputLabel>
            <Select className={classes.select}
                label={label}
                value={value || ''}
                onChange={event => onChange(event.target.value)}
            >
                {
                    (items || []).map(item =>
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    )
                }
            </Select>
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    )
}

export default SelectField;