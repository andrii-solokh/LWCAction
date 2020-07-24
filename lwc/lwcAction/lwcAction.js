import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class LwcAction extends LightningElement {
    @api recordId

    closeAction() {
        this.dispatchEvent(LwcAction.getCloseQuickAction())
    }

    refreshView() {
        this.dispatchEvent(LwcAction.getRefreshView())
    }

    showSpinner() {
        this.dispatchEvent(LwcAction.getSpinnerEvent(true))
    }

    hideSpinner() {
        this.dispatchEvent(LwcAction.getSpinnerEvent(false))
    }

    fireAuraEvent(name, params) {
        this.dispatchEvent(LwcAction.getAuraEvent(name, params))
    }


    // Fire events not from LwcAction context
    static fireCloseAction(element) {
        element.dispatchEvent(LwcAction.getCloseQuickAction())
    }

    static fireRefreshView(element) {
        element.dispatchEvent(LwcAction.getRefreshView())
    }

    static fireShowSpinner(element) {
        element.dispatchEvent(LwcAction.getSpinnerEvent(true))
    }

    static fireHideSpinner(element) {
        element.dispatchEvent(LwcAction.getSpinnerEvent(false))
    }

    static fireAuraEvent(element, name, params) {
        element.dispatchEvent(LwcAction.getAuraEvent(name, params))
    }


    // Aura events
    static getSpinnerEvent(isLoading) {
        return new CustomEvent('setloading', { detail: { isLoading: isLoading }, composed: true, bubbles: true })
    }

    static getCloseQuickAction() {
        return LwcAction.getAuraEvent('e.force:closeQuickAction')
    }

    static getRefreshView() {
        return LwcAction.getAuraEvent('e.force:refreshView')
    }

    
    // Get Aura events dynamicly
    static getAuraEvent(name, params) {
        return new CustomEvent('auraevent', { detail: { name: name, params : params}, composed: true, bubbles: true })
    }


    // Additional Features
    isReady = false

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
