//variables for neeeded HTML elements
const loanInput = document.getElementById('loan-input') as HTMLInputElement;
const interestInput = document.getElementById('interest') as HTMLInputElement;
const paybackInput = document.getElementById('payback') as HTMLInputElement;
const paymentPlanTable = document.querySelector('.amort-schedule') as HTMLTableElement;

const calcButton = document.querySelector('button') as HTMLButtonElement;

type Loan = {
    loanAmount: number,
    yearlyInterest: number,
    paybackYears: number
}

//eventlistener on calculate button
calcButton.addEventListener('click', checkInput);

//--------------------------------------------------
// FUNCTION check user input
//--------------------------------------------------
function checkInput(): void {

    const userInput: Loan = {
        loanAmount: parseInt(loanInput.value),
        yearlyInterest: parseFloat(interestInput.value),
        paybackYears: parseInt(paybackInput.value)
    }

    if(isNaN(userInput.loanAmount) || userInput.loanAmount < 100_000 || userInput.loanAmount > 10_000_000){
        alert("Lånebeloppet ska vara ett numeriskt värde mellan 100 000 och 10 000 000.");
        return;
    } else if (isNaN(userInput.yearlyInterest) || userInput.yearlyInterest < 0 || userInput.yearlyInterest > 50){
        alert("Räntan ska vara ett numeriskt värde mellan 0 och 100");
        return;
    } else if (isNaN(userInput.paybackYears) || userInput.paybackYears < 0 || userInput.paybackYears > 50){
        alert("Lånetiden ska vara ett numeriskt värde mellan 0 och 50");
        return;
    }
    calcMonthlyCost(userInput);
}

//--------------------------------------------------
// FUNCTION to calculate monthly loan cost
//--------------------------------------------------
function calcMonthlyCost(loan: Loan): void {

    //Calculate Monthly interest
    const monthlyInterest = loan.yearlyInterest/(100 * 12);

    //Calculate number of months to pay 
    const paybackMonths = loan.paybackYears * 12;

    //Calculate monthly cost
    const monthlyCost = loan.loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, paybackMonths)) / (Math.pow(1 + monthlyInterest, paybackMonths) -1);
    
    console.log(monthlyInterest, paybackMonths, monthlyCost);

    //function calls to display monthly cost and make a payment plan
    displayMonthlyCost(monthlyCost);
    makePaymentPlan(loan.loanAmount, monthlyCost, monthlyInterest, paybackMonths);
}

//--------------------------------------------------
// FUNCTION to display monthly loan cost
//--------------------------------------------------
function displayMonthlyCost(cost: number): void {
    const monthlyCostText = document.getElementById('monthly') as HTMLTableCellElement;
    monthlyCostText.textContent = cost.toFixed(2) + " kr";
    
    const payHeading = document.querySelector('.result-square') as HTMLElement;
    payHeading.textContent = Math.round(cost) + " kr";
}

//--------------------------------------------------
// FUNCTION to make payment plan
//--------------------------------------------------
function makePaymentPlan(amount: number, costPerMonth: number, interestPerMonth: number, monthsToPay: number): void {
    let loanLeft = amount;
    let totalRateCost: number = 0;

    //function to create headings in payment plan table
    createTableHeadings();

    //for loop to calculate monthly values
    for (let i = 0; i < monthsToPay; i++){
        let amortization = costPerMonth - (loanLeft * interestPerMonth);
        let interestRate = (loanLeft * interestPerMonth);
        totalRateCost += interestRate;
        loanLeft -= amortization;

        //create table row
        const tableRow = document.createElement('tr') as HTMLTableRowElement;

        //create table cell for MONTH, fill with content
        const tableCell1 = document.createElement('td') as HTMLTableCellElement;
        let currentIndex = (i+1).toString();
        tableCell1.textContent = currentIndex;

        //create table cell for INTEREST RATE, fill with content
        const tableCell2 = document.createElement('td') as HTMLTableCellElement;
        tableCell2.textContent = interestRate.toFixed(2);

        //create table cell for AMORTIZATION, fill with content
        const tableCell3 = document.createElement('td') as HTMLTableCellElement;
        tableCell3.textContent = amortization.toFixed(2);

        //create table cell REMAINING LOAN, fill with content
        const tableCell4 = document.createElement('td') as HTMLTableCellElement;
        tableCell4.textContent = loanLeft.toFixed(2);

        //append table cells to table row
        tableRow.append(tableCell1, tableCell2, tableCell3, tableCell4);
        //append table row to table
        paymentPlanTable.append(tableRow);
    }
    //functions to display total rate and total payment
    displayTotalRate(totalRateCost);
    displayTotalPayments(costPerMonth, monthsToPay);
}

//--------------------------------------------------
// FUNCTION to create PaymentPlan Table Headings
//--------------------------------------------------
function createTableHeadings(){
    //remove previous data from table
    paymentPlanTable.innerHTML = '';
    
    //create row for table headings
    const tableHeadingRow = document.createElement('tr') as HTMLTableRowElement;
    tableHeadingRow.classList.add('amort-headings');

    //create cells for table headings
    const monthHeading = document.createElement('th') as HTMLTableCellElement;
    monthHeading.textContent = "Månad";
    const rateHeading = document.createElement('th') as HTMLTableCellElement;
    rateHeading.textContent = "Räntekostnad";
    const amortHeading = document.createElement('th') as HTMLTableCellElement;
    amortHeading.textContent = "Amortering"
    const remLoanHeading = document.createElement('th') as HTMLTableCellElement;
    remLoanHeading.textContent = "Kvarstående Lån";

    //append headings to table row
    tableHeadingRow.append(monthHeading, rateHeading, amortHeading, remLoanHeading);
    //append table row to table
    paymentPlanTable.append(tableHeadingRow);
}

//--------------------------------------------------
// FUNCTION to display Total Rate
//--------------------------------------------------
function displayTotalRate(rate: number){
    const totalRate = document.getElementById('total-rate') as HTMLTableCellElement;
    totalRate.textContent = rate.toFixed(2) + " kr";
}

//--------------------------------------------------
// FUNCTION to display Total Payments
//--------------------------------------------------
function displayTotalPayments(cost: number, months: number) {
    const totalPay = document.getElementById('total-pay') as HTMLTableCellElement;
    const totalPayments = (cost * months);
    totalPay.textContent = totalPayments.toFixed(2) + " kr";
}