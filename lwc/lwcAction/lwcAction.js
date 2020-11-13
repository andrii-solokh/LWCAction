import { LightningElement, api } from "lwc";
export default class LwcAction extends LightningElement {
  @api recordId;
  @api sObjectName;

  isReady = false;

  ready() {
    this.hideSpinner();
    this.isReady = true;
  }

  closeAction() {
    this.dispatchEvent(LwcAction.getCloseQuickAction());
  }

  refreshView() {
    this.dispatchEvent(LwcAction.getRefreshView());
  }

  showSpinner() {
    this.dispatchEvent(LwcAction.getSpinnerEvent(true));
  }

  hideSpinner() {
    this.dispatchEvent(LwcAction.getSpinnerEvent(false));
  }

  fireAuraEvent(name, params) {
    this.dispatchEvent(LwcAction.getAuraEvent(name, params));
  }

  static fireCloseAction(element) {
    element.dispatchEvent(LwcAction.getCloseQuickAction());
  }

  static fireRefreshView(element) {
    element.dispatchEvent(LwcAction.getRefreshView());
  }

  static fireShowSpinner(element) {
    element.dispatchEvent(LwcAction.getSpinnerEvent(true));
  }

  static fireHideSpinner(element) {
    element.dispatchEvent(LwcAction.getSpinnerEvent(false));
  }

  static fireAuraEvent(element, name, params) {
    element.dispatchEvent(LwcAction.getAuraEvent(name, params));
  }

  static getSpinnerEvent(isLoading) {
    return new CustomEvent("setloading", {
      detail: { isLoading: isLoading },
      composed: true,
      bubbles: true,
    });
  }

  static getCloseQuickAction() {
    return LwcAction.getAuraEvent("e.force:closeQuickAction");
  }

  static getRefreshView() {
    return LwcAction.getAuraEvent("e.force:refreshView");
  }

  static getAuraEvent(name, params) {
    return new CustomEvent("auraevent", {
      detail: { name: name, params: params },
      composed: true,
      bubbles: true,
    });
  }
}
