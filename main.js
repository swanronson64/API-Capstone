'use strict';

$(document).ready(function () {
    const access_key = '0b60243c6e779ce451127759d8b9c8fe';
    const API_root = 'https://data.fixer.io/api/';

    /**
     * accesses object of all available currencies
     */
    $.ajax({
        url: `${API_root}symbols?access_key=${access_key}`,
        dataType: 'json',
        success: function (json) {

            renderList(json.symbols);
            console.log(json.symbols);
        }
    });

    /**
     * renders dropdown lists of available currencies
     */
    function renderList(obj) {
        for (const key in obj) {
            let dropdownOption = $("<option>", {
                value: `${key}`
            }).text(`${obj[key]} (${key})`);
            $(".populated-currency-list").append(dropdownOption);
        }
    }

    /**
     * tests for invalid characters / same currency.
     * displays message to user if test fails
     */
    function testInputs(amount, from, to) {
        if (!(amount > 0)) {
            $(".conversion-results").html('Please make sure that your input is a positive numeral, and that no special characters are used.');
            return false
        } else if (from == to) {
            $(".conversion-results").html('Please make sure that the currencies are not the same');
            return false
        } else return true

    }

    /**
     * defines values to be used in conversion
     */
    let from = $("#dropdown-1").val();
    let to = $("#dropdown-2").val();
    let amount = $("#conversion-amount").val();

    /**
     * executes API call for currency exchange
     */
    function convertCurrency() {
        let trueOrFalse = testInputs(amount, from, to);

        if (!trueOrFalse) {
            return;
        }
    };

    /**
     * execute the conversion using the "convert" endpoint, and then render it
     */
    $.ajax({
        url: `${API_root}convert?access_key=${access_key}&from=${from}&to=${to}&amount=${amount}`,
        dataType: 'json',
        success: function (json) {

            renderConversionResult(json);
        }
    });
    /**
     * renders conversion result to user including the base currency, amount to convert, and conversion result
     */
    function renderConversionResult(json) {
        let rate = json.info.rate;
        $(".conversion-results").html(`${amount} ${from} equals ${json.result} ${to} at a rate of ${rate}`)
    }

    /**
     * listens for form submission and executes conversion 
     */
    function handleConvertButtonClick(event) {
        $("#conversion-form").submit((function (event) {
            event.preventDefault();
            convertCurrency();
        }));
    }

    /**
     * executes event listeners
     */
    function registerEvents() {
        handleConvertButtonClick();
    }
    registerEvents();
});