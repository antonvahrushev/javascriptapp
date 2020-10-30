import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import DoneIcon from '@material-ui/icons/Done';
import CropIcon from '@material-ui/icons/Crop';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import RestoreIcon from '@material-ui/icons/Restore';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { EMPTY_FIELD_VALUE } from '../../constants';

const useStyles = makeStyles(theme => ({
    imageBox: {
        height: "300px",
        position: "relative",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.23)'
    },
    imageBoxInvalid: {
        borderColor: theme.palette.error.main
    },
    imageInput: {
        cursor: "pointer",
        position: "absolute",
        left: "0",
        bottom: "0",
        top: "0",
        width: "100%",
        opacity: 0
    },
    imageStyle: {
        maxWidth: "355px",
        maxHeight: "298px",
        verticalAlign: "middle"
    },
    cropper: {
        width: '100%',
        maxHeight: "298px",
    },
    loadImageIcon: {
        margin: theme.spacing(1),
        position: "absolute", bottom: "0", left: "0"
    },
    deleteImageIcon: {
        margin: theme.spacing(1),
        position: "absolute", bottom: "0", right: "0"
    },
    cropImageIcon: {
        margin: theme.spacing(1),
        position: "absolute", bottom: "0", left: "48px"
    },
    leftBottomContainer: {
        position: "absolute", bottom: "0", left: "0"
    },
    rightBottomContainer: {
        position: "absolute", bottom: "0", right: "0"
    },
    iconButton: {
        margin: theme.spacing(1),
    },
    fieldNameText: {
        color: theme.palette.text.disabled
    },
    fieldNameTextInvalid: {
        color: theme.palette.error.main
    },
}));

function ImageInputField({ field, onChange, error }) {
    const classes = useStyles();
    const inputEl = useRef(null);
    const cropper = useRef(null);
    const [showCropper, setShowCropper] = useState(false);
    const [originalImageBase64, setOriginalImageBase64] = useState('');

    const pic = field.value.base64;

    const setImage = (key) => (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];
        if (file) {
            reader.onload = () => {
                setOriginalImageBase64(reader.result);
                onChange(key, { base64: reader.result, file, str: '' });
            };
            reader.readAsDataURL(file);
        }
    }

    const cropImage = () => {
        const roundedValues = true;
        const cropData = cropper.current.getData(roundedValues);
        const cropOptions = {
            minX: cropData.x,
            minY: cropData.y,
            maxX: cropData.x + cropData.width,
            maxY: cropData.y + cropData.height,
            rotate: cropData.rotate >= 0 ? cropData.rotate : cropData.rotate + 360
        }
        onChange(field.id, { base64: cropper.current.getCroppedCanvas().toDataURL(), file: field.value.file, str: field.value.str, cropOptions });
        setShowCropper(false);
    }

    return (
        <Paper variant="outlined" className={classes.imageBox + ' ' + (error ? classes.imageBoxInvalid : '')}>
            <input ref={inputEl} onChange={setImage(field.id)} className={classes.imageInput} type="file" accept="image/*" multiple={false} aria-label="Load" />
            {!pic && <>
                <Typography variant="h6" className={classes.fieldNameText + ' ' + (error ? classes.fieldNameTextInvalid : '')} align="center">
                    {error || field.name}
                </Typography>
                <div className={classes.leftBottomContainer}>
                    <Fab size="small" className={classes.iconButton} onClick={() => inputEl.current.click()}><ImageIcon /></Fab>
                </div></>
            }
            {pic &&
                <>
                    {showCropper &&
                        <>
                            <Cropper ref={cropper}
                                className={classes.cropper}
                                src={originalImageBase64}
                                guides={true}
                            />
                            <div className={classes.leftBottomContainer}>
                                <Fab size="small" className={classes.iconButton} onClick={() => setShowCropper(false)} aria-label="Original">
                                    <CropOriginalIcon />
                                </Fab>
                            </div>
                            <div className={classes.rightBottomContainer}>
                                <Fab size="small" className={classes.iconButton} onClick={() => cropper.current.reset()} aria-label="Restore">
                                    <RestoreIcon />
                                </Fab>
                                <Fab size="small" className={classes.iconButton} onClick={() => cropper.current.rotate(-90)} aria-label="Rotate">
                                    <RotateLeftIcon />
                                </Fab>
                                <Fab size="small" className={classes.iconButton} onClick={() => cropper.current.rotate(90)} aria-label="Rotate">
                                    <RotateRightIcon />
                                </Fab>
                                <Fab size="small" className={classes.iconButton} onClick={() => cropImage()} aria-label="Done">
                                    <DoneIcon />
                                </Fab>
                            </div>
                        </>
                    }
                    {!showCropper &&
                        <>
                            <img alt={field.name} src={pic} className={classes.imageStyle} />
                            <div className={classes.leftBottomContainer}>
                                <Fab size="small" className={classes.iconButton} onClick={() => setShowCropper(true)} aria-label="Crop">
                                    <CropIcon />
                                </Fab>
                            </div>
                            <div className={classes.rightBottomContainer}>
                                <Fab size="small" className={classes.iconButton} onClick={() => onChange(field.id, EMPTY_FIELD_VALUE)} aria-label="Delete">
                                    <DeleteIcon />
                                </Fab>
                            </div>
                        </>
                    }
                </>
            }
        </Paper>
    )
}

export default ImageInputField;