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
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    imageBox: {
        height: "300px",
        position: "relative",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.23)'
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
}));

function ImageInputField({ source, disabled, onChange }) {
    const classes = useStyles();
    const inputEl = useRef(null);
    const cropper = useRef(null);
    const [showCropper, setShowCropper] = useState(false);

    const setImage = () => (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];
        if (file) {
            reader.onload = () => {
                onChange(reader.result, file);
            };
            reader.readAsDataURL(file);
        }
    }

    const cropImage = () => {
        cropper.current.getCroppedCanvas().toBlob((blob) => {
            onChange(cropper.current.getCroppedCanvas().toDataURL(), blob);
            setShowCropper(false);
        })
    }

    const isImageAsUrl = source && source.startsWith("http");

    return (
        <Paper variant="outlined" className={classes.imageBox}>
            <input ref={inputEl} onChange={setImage()} className={classes.imageInput} type="file" accept="image/*" multiple={false} aria-label="Load"  disabled={disabled}/>
            {!source &&
                <>
                    <Typography variant="h6" className={classes.fieldNameText} align="center">
                        Bild
                    </Typography>
                    <div className={classes.leftBottomContainer}>
                        <Fab size="small" className={classes.iconButton} onClick={() => inputEl.current.click()} disabled={disabled}><ImageIcon /></Fab>
                    </div>
                </>
            }
            {source &&
                <>
                    {showCropper &&
                        <>
                            <Cropper ref={cropper}
                                className={classes.cropper}
                                src={source}
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
                            <img alt='Bild' src={isImageAsUrl ? source + `?t=${moment().unix()}` : source} className={classes.imageStyle} />
                            <div className={classes.leftBottomContainer}>
                                {!isImageAsUrl && // CORS problem when fetch image as url (need to fix on the server side? )
                                    <Fab size="small" className={classes.iconButton} onClick={() => setShowCropper(true)} aria-label="Crop" disabled={disabled}>
                                        <CropIcon />
                                    </Fab>
                                }
                            </div>
                            <div className={classes.rightBottomContainer}>
                                <Fab size="small" className={classes.iconButton} onClick={() => onChange()} aria-label="Delete" disabled={disabled}>
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