import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class LwcAction extends LightningElement {
    @api recordId
    isReady = false

    closeAction() {
        this.dispatchEvent(LwcAction.getCloseActionEvent())
    }

    showSpinner() {
        this.dispatchEvent(LwcAction.getSpinnerEvent(true))
    }

    hideSpinner() {
        this.dispatchEvent(LwcAction.getSpinnerEvent(false))
    }

    static fireCloseAction(element) {
        element.dispatchEvent(LwcAction.getCloseActionEvent())
    }

    static fireShowSpinner(element) {
        element.dispatchEvent(LwcAction.getSpinnerEvent(true))
    }

    static fireHideSpinner(element) {
        element.dispatchEvent(LwcAction.getSpinnerEvent(false))
    }

    static getSpinnerEvent(isLoading) {
        return new CustomEvent('set_loading', { detail: { isLoading: isLoading }, composed: true, bubbles: true })
    }

    static getCloseActionEvent(isLoading) {
        return new CustomEvent('close_action', { composed: true, bubbles: true })
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
                action(data)
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
