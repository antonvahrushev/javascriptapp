import {
    combineValidators,
    createValidator,
    hasLengthGreaterThan,
    matchesPattern,    
    isRequiredIf,
    isRequired, isOneOf
} from 'revalidate';
import { FIELD_TYPE } from '../../constants';

// they are reducers
const publishDatesValidator = createValidator(
    message => (dates, advert) => {
        if (!advert.forceValidation) return; // too early to validate
        if (!advert.selectedPublishTime)
            return `Du har inte bokat införingsdatum`;
        
        const publishTime = advert.publishTimes.find(time => time.publishTimeText == advert.selectedPublishTime);
        if (!publishTime) {
            console.error(`"${advert.selectedPublishTime}" not found in the list`);
            return; // something strange
        }
        if (publishTime.days != dates.length)
           return `Du har bokat ${dates.length} införingsdatum av ${publishTime.days}.<br />Välj fler införingsdatum för att gå vidare.`;
    },
    ''
);

const emailValidator = createValidator(
    message => (email, advert) => {
        if (!advert.forceValidation) return; // too early to validate
        email = email || '';
        return isRequired({ message: 'E-postadressen är obligatoriska fält'})(email)
            || matchesPattern(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
                ({ message: 'Kontrollera e-postadressen - den är i felaktigt format'})(email.trim());
    },
    ''
);

const phoneValidator = createValidator(
    message => (phone, advert) => {
        if (!advert.forceValidation) return; // too early to validate
        phone = phone || '';
        let formatErrMsg = matchesPattern
            (/^([0-9][\s,-]*){8,9}[0-9]$/)
            ({ message: 'Kontrollera telefonnumret - den är i felaktigt format'})
            (phone.trim());
        formatErrMsg = formatErrMsg && matchesPattern
            (/^\+46[\s,-]*([0-9][\s,-]*){8}[0-9]$/)
            ({ message: 'Kontrollera telefonnumret - den är i felaktigt format'})
            (phone.trim());
            
        return isRequired({ message: 'Telefonnumret är obligatoriska fält'})(phone)
            || formatErrMsg;
    },
    ''
);

const nameValidator = createValidator(
    message => (name, advert) => {
        if (!advert.forceValidation) return; // too early to validate
        name = name || '';
        return (
            hasLengthGreaterThan(1)({ message: 'Skriv minst två bokstäver' })(name.trim())
            ||
            isRequired({ message: 'Skriv minst två bokstäver'})(name.trim())
        );
    },
    ''
);

const fieldsMetadataValidator = createValidator(
    message => (fields, advert) => {
        if (!fields || Object.keys(fields).length === 0) return;

        const errors = {};
        Object.entries(fields).forEach(([key, field]) => {
            const strValue = field.value.str.trim();
            const base64 = field.value.base64; // image
            // mark the field red only after the validation has been forced
            if ((advert.forceValidation || advert.forcePreviewValidation) && field.isRequired && !strValue && !base64) {
                errors[key] = 'Obligatoriska fält';
                return;
            }

            if (field.type === FIELD_TYPE.IMAGE) return;

            // *** lines amount validation ***
            const lines = strValue.split('\n');
            if (lines.length > field.totalAllowedRows) {
                errors[key] = field.name; // usually the displayed field.name already contains a restriction text
                return;
            }
            // ***

            // *** validate total text length ***
            let total = 0;
            const max = field.caMaxCharacterCountPerRow * field.totalAllowedRows;
            lines.forEach(l => total += l.length);
            if (total > max) {
                errors[key] = `${max} - max antal tecknen`;
                return;
            }
            // ***
        });

        if (Object.keys(errors).length > 0) return errors; // invalid
        return; // valid
    },
    ''
);

export default combineValidators({
    advertiserName: nameValidator(),
    advertiserEmail: emailValidator(),
    advertiserPhone: phoneValidator(),
    previewImage: isRequiredIf(advert => advert.forceValidation)({ message: 'Visa förhandsgranskning för att komma vidare' }),
    previewImageValid: isOneOf([true])({ message: 'Image is invalid (sv)' }),
    selectedPublishTime: isRequiredIf(advert => advert.forceValidation)({ message: 'Pris är en obligatoriska fält' }),
    publishDates: publishDatesValidator(),
    fieldsMetaData: fieldsMetadataValidator()
});