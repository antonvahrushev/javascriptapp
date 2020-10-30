import React from 'react';
import { connect } from "react-redux";
import Typography from '@material-ui/core/Typography';

function FinishPanel(props) {
    let finish = props.mailHtml 
        ? <iframe srcDoc={props.mailHtml.replace(/width: 750px;/, '')} style={{border: 'none', width: '100%', height: '700px'}} />
        : <Typography variant="h6" align='center'>
            Tack, annonsen är nu bokad! Tack för din beställning. Du får en bekräftelse via e-post. Annonsen granskas därefter av vår Kundservice och du får ytterligare en bekräftelse via e-post när annonsen är godkänd. Om annonsen inte godkänns meddelar vi dig detta.
        </Typography>

    return finish;
}

const mapStateToProps = state => ({
    mailHtml: state.payment.mailHtml
})

export default connect(mapStateToProps)(FinishPanel);