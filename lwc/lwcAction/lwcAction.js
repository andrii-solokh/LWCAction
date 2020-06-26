import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class LwcAction extends LightningElement {
    @api recordId
    isReady = false

    closeAction() {
        this.dispatchEvent(new CustomEvent('СloseAction'))
    }

    showSpinner() {
        this.dispatchEvent(this.spinnerEvent(true))
    }

    hideSpinner() {
        this.dispatchEvent(this.spinnerEvent(false))
    }

    spinnerEvent(isLoading) {
        return new CustomEvent('SetLoading', {detail:{isLoading: isLoading}})
    }

    ready() {
        this.hideSpinner()
        this.isReady = true
    }

    handleWire(value, action) {
        const {error, data} = value
        try {
            if (error) {
                throw error.body.message
            } else if (data) {
                const status = data.status
                if (status === 'ERROR') {
                    throw data.error_message
                } else if (status === 'SUCCESS') {
                    action(data)
                }
            }
        } catch(error) {
            let message = error.message || error
            console.error(error);
            this.hideSpinner()
            this.closeAction()
            this.showToast('Error', message, 'error')
        }
    }

    showToast(title, message, variant) {
        const toast = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        })
        this.dispatchEvent(toast)  
    }
}