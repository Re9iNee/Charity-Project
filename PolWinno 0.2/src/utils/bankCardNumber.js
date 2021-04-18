const validateCreditCard = (creditCardNumber) => {
    let numbers = creditCardNumber.split('');
    numbers = numbers.map((num, index) => {
        if (index % 2 == 0) {
            // even index multiply by two
            let multiplied = num * 2;
            // if multiplied value is over 9, subtract it from 9 to make single digit numbers.
            if (multiplied > 9 ){
                multiplied -= 9;
            }
            return multiplied;
        }else {
            // odd index multiply by one
            return Number(num);
        }
    });
    numbers = numbers.reduce((acc, currentValue) => currentValue + acc, 0);
    // if numbers accumlation was divisible to ten. then the card is valid.
    let divisible = numbers % 10 ? false : true;
    return divisible;
}

module.exports = {
    validateCreditCard,
}