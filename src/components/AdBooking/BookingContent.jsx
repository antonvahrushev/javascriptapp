import React, { useState, useRef } from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import { FIELD_TYPE } from '../../constants';
import { setInputField, setImageInputField } from '../../redux/actions/advert';
import ImageInputField from './ImageInputField';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    item: {
        marginTop: theme.spacing(2),
    },
}))

function BookingContent({ fieldsMetaData, errors, setInputField, setImageInputField }) {
    const classes = useStyles();

    return (
        <Collapse in={Object.keys(fieldsMetaData).length > 0} className={classes.root}>
            <Grid container >
                <Grid item xs={12} >
                    <Typography variant="h6">
                        Annonstext
                    </Typography>
                </Grid>
                {
                    Object.keys(fieldsMetaData).map(key => {
                        const error = errors[key];
                        const field = fieldsMetaData[key];
                        switch (field.type) {
                            case FIELD_TYPE.IMAGE:
                                return (
                                    <Grid key={key} item xs={12} className={classes.item}>
                                        <ImageInputField field={field} onChange={setImageInputField} error={error} />
                                    </Grid>
                                )
                            case FIELD_TYPE.TEXT:
                                return (
                                    <Grid key={key} item xs={12} className={classes.item}>
                                        <TextField fullWidth
                                            error={!!error}
                                            helperText={error}
                                            variant="outlined"
                                            label={field.name}
                                            value={field.value.str}
                                            onChange={(event) => setInputField(key, { file: null, base64: null, str: event.target.value })}
                                        />
                                    </Grid>
                                )
                            case FIELD_TYPE.MULTIROWS_TEXT:
                                return (
                                    <Grid key={key} item xs={12} className={classes.item}>
                                        <TextField fullWidth
                                            error={!!error}
                                            helperText={error}
                                            multiline
                                            rows="5"
                                            variant="outlined"
                                            label={field.name}
                                            value={field.value.str}
                                            onChange={(event) => setInputField(key, { file: null, base64: null, str: event.target.value })}
                                        />
                                    </Grid>
                                )
                        }
                    })
                }
            </Grid>
        </Collapse>
    )
}

const mapStateToProps = state => ({
    fieldsMetaData: state.advert.fieldsMetaData,
    errors: state.advert.advertErrors.fieldsMetaData || {}
})

export default connect(mapStateToProps, { setInputField, setImageInputField })(BookingContent);