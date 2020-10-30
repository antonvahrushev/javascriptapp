import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
    level1: {
    },
    level2: {
        paddingLeft: theme.spacing(1)
    },
    level3: {
        paddingLeft: theme.spacing(2)
    },
    level4: {
        paddingLeft: theme.spacing(3)
    },
    level5: {
        paddingLeft: theme.spacing(4)
    }
}));

function GroupingSelectField({ className, items, value, onChange, error, label }) {
    const classes = useStyles();

    //TODO: get dynamic class name
    const getClassName = level => {
        return classes.hasOwnProperty('level' + level) ? classes['level' + level] : classes.level5;
    }

    return (
        <FormControl className={className}
            disabled={!(items && (items.length > 0))}
            error={!!error}
            variant="outlined"
            fullWidth >
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                value={value || ''}
                onChange={event => onChange(event.target.value)}
            >
                {
                    (items || []).map(item => 
                        <MenuItem key={item.id} value={item.id} disabled={item.isGroup}>
                            <span className={getClassName(item.groupLevel)}>{item.name}</span>
                        </MenuItem>
                    )
                }
            </Select>
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    )
}

export default GroupingSelectField;