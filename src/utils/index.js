import { WIZARD_STEPS } from '../constants';

export function getAdvertParentId() {
    return parseInt(window.location.pathname.trim().substring(1));
}

// pathname is like /10944 or /10944/payment
export function getStepNumber(pathname) {
    const step = Object.values(WIZARD_STEPS).find(s => {
        const pattern = (s.path+'$').replace('/:adParentId', '^\/\\d*');
        return new RegExp(pattern).test(pathname);       
    });

    if (!step) return 0;

    return step.step;
}

export function getPathname(stepNumber, adParentId) {
    const step = Object.values(WIZARD_STEPS).find(s => {
        return s.step === stepNumber
    });
    return step.path.replace(':adParentId', adParentId);
}