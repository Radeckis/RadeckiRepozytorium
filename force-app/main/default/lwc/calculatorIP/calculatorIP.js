import { LightningElement } from 'lwc';
export default class App extends LightningElement {
  score = "0";
  scoreUp = " "
  justCalculated = false;
  
  addNumber(event) {
    const clickedValue = event.target.dataset.value;
    const lastPlus = this.score.lastIndexOf("+");
    const lastMinus = this.score.lastIndexOf("-");
    const lastx = this.score.lastIndexOf("x");
    const lastDivide = this.score.lastIndexOf("÷");
    const lastOperator = Math.max(lastDivide,lastMinus,lastPlus,lastx);
    const currentNumber = this.score.slice(lastOperator + 1);
    if (currentNumber.includes(",") && clickedValue === ",") {
      
    } else if (this.justCalculated === true) {
      this.score = clickedValue;
      this.scoreUp = "";
      this.justCalculated = false;
    } else if (this.score === "0" && clickedValue !== ",") {
      this.score = clickedValue;
    } else if (currentNumber === "" && clickedValue === ",") {
      this.score = this.score + "0,";
    } else if (currentNumber === "0" && clickedValue !== ",") {
      this.score = this.score.slice(0, -1);
      this.score = this.score + clickedValue;
    } else {
      this.score = this.score + clickedValue;
    }
  }
  addOperator(event) {
    const clickedValue = event.target.dataset.value;
    const latestChar = this.score.slice(-1);
    const latestTwoChars = this.score.slice(-2);
    if ((latestChar === "x" || latestChar === "÷") && clickedValue === "-") {
      this.score = this.score + clickedValue;
    } else if ((latestTwoChars === "x-" || latestTwoChars === "÷-") && clickedValue === "-") {

    } else if (latestTwoChars === "x-" || latestTwoChars === "÷-") {
      this.score = this.score.slice(0, -2);
      this.score = this.score + clickedValue;
    } else if (latestChar === "+" || latestChar === "-" || latestChar === "x" || latestChar === "÷") {
      this.score = this.score.slice(0, -1);
      this.score = this.score + clickedValue;
    } else if (clickedValue === "+" || clickedValue === "-" || clickedValue === "x" || clickedValue === "÷") {
      this.score = this.score + clickedValue;
      this.scoreUp = "";
      this.justCalculated = false;
    }
  }
  undoLast() {
    if (this.justCalculated === true) {
      this.score = "0";
      this.scoreUp = "";
      this.justCalculated = false;
    } else {
      this.score = this.score.slice(0, -1);
      if (this.score === "") {
        this.score = "0";
      }
    }
  }
  clearScore() {
      this.score = "0";
      this.scoreUp = "";
  }
  square() {
    if (this.score.includes("+") || this.score.includes("-") || this.score.includes("x") || this.score.includes("÷")) {
    
    } else {
      this.score = this.score.replace(",", ".");
      this.scoreUp = this.score.replace(".", ",");
      this.score = Math.sqrt(Number(this.score)).toString();
      this.score = this.score.replace(".", ",");
      this.justCalculated = true;
    }
  }
  percent() {
    if (this.score.includes("+") || this.score.includes("-") || this.score.includes("x") || this.score.includes("÷")) {
    } else {
      this.score = this.score.replace(",", ".");
      this.scoreUp = this.score.replace(".", ",");
      this.score = (Number(this.score) / 100).toString();
      this.score = this.score.replace(".", ",");
      this.justCalculated = true;
    }
  }
  equals() {
      this.score = this.score.replaceAll(",", ".");
    const operators = this.score.match(/[+\-x÷]/g);
    const numbers = this.score.split(/[+\-x÷]/);
    const newNumbers = [Number(numbers[0])];
    const newOperators = [];
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "x") {
      newNumbers[newNumbers.length - 1] = newNumbers[newNumbers.length - 1] * Number(numbers[i + 1]);
    } else if (operators[i] === "÷") {
      newNumbers[newNumbers.length - 1] = newNumbers[newNumbers.length - 1] / Number(numbers[i + 1]);
    } else {
      newOperators.push(operators[i]);
      newNumbers.push(Number(numbers[i + 1]));
    }
  } let result = newNumbers[0];
    for (let i = 0; i < newOperators.length; i++) {
      this.scoreUp = this.score.replaceAll(".", ",");
      if (newOperators[i] === "+") {
      result = result + newNumbers[i + 1];
    } else if (newOperators[i] === "-") {
      result = result - newNumbers[i + 1];
    }
  }
      this.score = result.toString();
      this.score = this.score.replace(".", ",");
  }
}