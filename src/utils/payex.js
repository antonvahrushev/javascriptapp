export const PaymentMethods = {
    CreditCard: 1,
    Invoice: 2,
    Swish: 3
}

export default (function() {
    var _payex = null;

    function openAsync(containerId, iframeUrl, paymentMethod, onPaymentCompleted) {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = iframeUrl;
            let container = document.getElementById(containerId);
            if (!container) {
                reject({ message: 'Can not find ' + containerId});
                return;
            }
            container.append(script);
            script.onload = function () {
                switch (paymentMethod) {
                    case PaymentMethods.CreditCard:
                        try {
                            _payex = payex.hostedView.creditCard({
                                container: containerId,
                                onPaymentCompleted: function (obj) { onPaymentCompleted(obj); },
                            });    
                        } catch(e) {
                            reject({ message: 'PayEx init error: payment method - CreditCard.'});
                        }
                        break;
                    case PaymentMethods.Invoice:
                        try {
                            _payex = payex.hostedView.invoice({
                                container: containerId,
                                onPaymentCompleted: function (obj) { onPaymentCompleted(obj); },
                            });    
                        } catch(e) {
                            reject({ message: 'PayEx init error: payment method - Invoice.'});
                        }
                        break;
                    case PaymentMethods.Swish:
                        try {
                            _payex = payex.hostedView.swish({
                                container: containerId,
                                onPaymentCompleted: function (obj) { onPaymentCompleted(obj); },
                            });    
                        } catch(e) {
                            reject({ message: 'PayEx init error: payment method - Swish.'});
                        }
                        break;
                    default:  
                        reject({ message: 'Unknown payment method. Expected values: 1 - CreditCard, 2 - Invoice, 3 - Swish.'});
                        return;
                }
                _payex.open();
                resolve();
            };    
        });
    }

    function close() {
        if (!_payex) return;
        _payex.close();
    }

    return {
        openAsync,
        close
    }
})();