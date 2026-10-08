import { LightningElement } from 'lwc';
import TLO from '@salesforce/resourceUrl/tlo';
import ROYALTY_FONT from '@salesforce/resourceUrl/RoyaltyCriminals';

export default class TloStrony extends LightningElement {
    initialized = false;

    renderedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        const fontStyle = document.createElement('style');
        fontStyle.innerText = '@font-face { font-family: "RoyaltyCriminals"; src: url("' + ROYALTY_FONT + '") format("truetype"); }';
        document.head.appendChild(fontStyle);

        const htmlBackground = document.createElement('style');
        htmlBackground.innerText = 'html { background-image: url(' + TLO + ') !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }';
        document.head.appendChild(htmlBackground);
    }
}