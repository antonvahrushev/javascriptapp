import React, { useState } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DatePicker } from "@material-ui/pickers";
import Badge from '@material-ui/core/Badge';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import { loadPrintPreview } from '../../redux/actions/advert';
import { setSelectedPublishTime, setPublishDates } from '../../redux/actions/advert';
import SelectField from '../common/SelectField';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    item: {
        paddingBottom: theme.spacing(2),
    },
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
    imageStyle: {
        maxWidth: "355px",
        maxHeight: "298px",
        verticalAlign: "middle"
    },
    calendarBorder: {
        overflow: 'auto',
        borderColor: 'rgba(0, 0, 0, 0.23)',
        display: 'flex',
        flexDirection: 'column',
    },
    calendarBlocker: {
        position: "relative",
        display: 'flex',
        justifyContent: 'center',        
    },
    disabledBlock: {
        pointerEvents: 'none',
        opacity: '0.7'
    },
    invalidCalendar: {
        border: `1px solid`,
        borderColor: theme.palette.error.main,
        borderRadius: '4px',
    },
    invalidCalendarMessages: {
        backgroundColor: '#ffe6e6',
    },
    refreshImageIcon: {
        margin: theme.spacing(1),
        position: "absolute", bottom: "0", right: "0"
    },
    previewText: {
        color: theme.palette.text.disabled
    },
    previewTextInvalid: {
        color: theme.palette.error.main
    },
}))

function PreviewPanel({ previewImage, publishTimes, publishDates, publishDateDeadlines, selectedPublishTime, errors, setSelectedPublishTime, setPublishDates, loadPrintPreview }) {
    const classes = useStyles();
    const [selectedDay, setSelectedDay] = useState();
    const [init, setInit] = useState(true);

    const isCalendarDisabled = !(previewImage && selectedPublishTime);  
    const isCalendarInvalid = !!errors.publishDates && Object.keys(errors.publishDates).length > 0;

    const getInitialFocusedDate = () => {
        //return first of the selected publish dates
        if (publishDates && publishDates.length > 0) {
            return publishDates[0];
        }
        //return the first available day
        if (publishDateDeadlines && publishDateDeadlines.deadlines) {
            let firstAvailableDate = publishDateDeadlines.deadlines.find(deadline => deadline.available && (moment(deadline.date) >= moment()));
            if (firstAvailableDate) return firstAvailableDate.date;
        }
        return moment();
    }

    const changeSelectedDay = (date) => {
        if (!init) { //hack, onChange occurs when day is disabled in shouldDisableDate
            let index = publishDates.indexOf(date.format('YYYY-MM-DD'));
            if (index > -1) {
                publishDates.splice(index, 1);
            } else {
                publishDates.push(date.format('YYYY-MM-DD'));
                publishDates.sort();
            }
            setPublishDates(publishDates);
            setSelectedDay(date);
        } else {
            setInit(!init);
        }
    }

    const shouldDisableDate = (day) => {
        // check publish days count
        let publishTime = publishTimes.find(time => time.publishTimeText == selectedPublishTime);
        if (!publishTime) return true; // publish time does not selected yet
        if ((publishTime.days <= publishDates.length) && !publishDates.includes(day.format('YYYY-MM-DD'))) {
            return true; // limit is reached
        }
        // check border days
        if (publishDates && (publishDates.length > 0) && publishDateDeadlines && (publishDateDeadlines.daysApart > 0)) {
            let rightBorder = moment(publishDates[0]).add(publishDateDeadlines.daysApart, 'days');
            let leftBorder = moment(publishDates[publishDates.length - 1]).subtract(publishDateDeadlines.daysApart, 'days');
            if (day < leftBorder || rightBorder < day) {
                return true;
            }
        }

        //check deadlines
        if (publishDateDeadlines && publishDateDeadlines.deadlines) {
            let index = publishDateDeadlines.deadlines.findIndex(deadline => deadline.date == day.format('YYYY-MM-DD'));
            if (index > -1) return !publishDateDeadlines.deadlines[index].available;
        }
        return true;
    }


    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} >
                <Typography variant="h6" className={classes.item}>
                    Förhandsgranskning
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.item}>
                <Paper variant="outlined" className={classes.imageBox + ' ' + (errors.previewImage || errors.previewImageValid ? classes.imageBoxInvalid : '')} >
                    {!previewImage && <Typography variant="h6" className={classes.previewText + ' ' + (errors.previewImage ? classes.previewTextInvalid : '')} align="center">
                        Visa förhandsgranskning för att komma vidare
                    </Typography>
                    }
                    {previewImage && <img alt="Bild" src={previewImage} className={classes.imageStyle} />}
                    <Fab aria-label="Refresh preview" className={classes.refreshImageIcon} size="small" onClick={(event) => loadPrintPreview()}><RefreshIcon /></Fab>
                </Paper>
                {
                    !errors.previewImageValid ? null : <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-filled">{errors.previewImageValid}</p>
                }
            </Grid>
            <Grid item xs={12} className={classes.item}>
                <SelectField disabled={!previewImage} error={errors.selectedPublishTime}
                    helperText={errors.selectedPublishTime}
                    label="Pris"
                    value={selectedPublishTime}
                    items={publishTimes}
                    onChange={value => setSelectedPublishTime(value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" className={classes.item}>
                    Välj publiceringdatum
                </Typography>
                <Paper variant="outlined" className={classes.calendarBorder + ' ' + (isCalendarInvalid ? classes.invalidCalendar : '')}>
                    <div className={classes.calendarBlocker + ' ' + (isCalendarDisabled ? classes.disabledBlock : '')}>
                        <DatePicker
                            disableToolbar
                            disablePast
                            orientation="portrait"
                            variant="static"
                            openTo="date"
                            maxDate={moment().add(1, 'months').endOf('month')}
                            value={selectedDay}
                            initialFocusedDate={getInitialFocusedDate()}
                            onChange={(date) => changeSelectedDay(date)}
                            renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
                                let isSelected = publishDates.includes(day.format('YYYY-MM-DD'));
                                return isSelected && isInCurrentMonth ?
                                    <Badge color="secondary" variant="dot" overlap="circle">{dayComponent}</Badge>
                                    : dayComponent
                            }}
                            shouldDisableDate={shouldDisableDate}
                        />
                    </div>
                    {                        
                        !isCalendarInvalid ? null : 
                        <div className={classes.invalidCalendarMessages}>
                            <p dangerouslySetInnerHTML={{ __html: errors.publishDates }} className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error MuiFormHelperText-filled" />
                        </div>
                    }
                </Paper>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => ({
    publishTimes: state.advert.publishTimes,
    selectedPublishTime: state.advert.selectedPublishTime,
    publishDates: state.advert.publishDates || [],
    publishDateDeadlines: state.advert.publishDateDeadlines,
    previewImage: state.advert.previewImage,
    errors: state.advert.advertErrors

})

export default connect(mapStateToProps, { setSelectedPublishTime, setPublishDates, loadPrintPreview })(PreviewPanel);