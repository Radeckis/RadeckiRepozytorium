import { LightningElement } from 'lwc';

export default class Kalkulator extends LightningElement {
    numberA = 0;
    numberB = 0;
    result = 0;

    handleAChange(event) {
        this.numberA = parseFloat(event.target.value) || 0;
    }

    handleBChange(event) {
        this.numberB = parseFloat(event.target.value) || 0;
    }

    handleAdd() {
        this.result = this.numberA + this.numberB;
    }

    handleSubtract() {
        this.result = this.numberA - this.numberB;
    }

    handleMultiply() {
        this.result = this.numberA * this.numberB;
    }

    handleDivide() {
        this.result = this.numberB !== 0 ? this.numberA / this.numberB : 'Błąd: dzielenie przez 0';
    }
}