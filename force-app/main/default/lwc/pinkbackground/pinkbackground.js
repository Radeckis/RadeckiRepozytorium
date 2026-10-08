import { LightningElement } from 'lwc';

export default class TloRozowe extends LightningElement {
    initialized = false;

renderedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const style = document.createElement('style');
    style.innerText =
        'html, body {' +
        'background-color: #fd96c1 !important;' +
        'min-height: 100%;' +
        'margin: 0 !important;' +
        'padding: 0 !important;' +
        '}' +
        '#brandBand_1, .slds-template__container, .DESKTOP.oneAlohaPage, .oneAppLayoutHost, .viewport, .colSide, .colMain, .top, .bottomWrapper, .bottomLeft, .bottomRight, .flexipagePage, .homeDesktopTemplate, .homeLanding {' +
        'background-color: #fd96c1 !important;' +
        '}';
    document.head.appendChild(style);
}
}