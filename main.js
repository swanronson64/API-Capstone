'use strict';

$(document).ready(function () {
    const access_key = '0b60243c6e779ce451127759d8b9c8fe';
    const API_root = 'https://data.fixer.io/api/';

    /**
     * declares the ajax request to access all available currencies
     */
    const symbolsCall = $.ajax({
        url: `${API_root}symbols?access_key=${access_key}`,
        dataType: 'json'
    });

    /**
     * applies styling rules to dropdowns
     */
    function formatDropDowns() {
        $('#dropdown-1').select2({
            placeholder: 'Select a currency',
            width: '75%',

        });
        $('#dropdown-2').select2({
            placeholder: 'Select a currency',
            width: '75%',

        })
    }

    /**
     * accesses object of all available currencies
     */
    symbolsCall.done(function (json) {
        renderList(json.symbols);
    }).fail(function () {
        $(".populated-currency-list").append(`Cannot retrieve currency list`);
        return;
    });

    /**
     * renders dropdown lists of available currencies
     */
    function renderList(obj) {
        $(".populated-currency-list").append($("<option>", {
            class: `placeholder-option`
        }))
        for (const key in obj) {
            let dropdownOption = $("<option>", {
                value: `${key}`
            }).text(`${obj[key]} (${key})`);
            $(".populated-currency-list").append(dropdownOption);
        }
    }

    /**
     * tests if user selected same currency.
     * displays message to user if test fails
     */

    function testInputs(values) {
        if (values.from == values.to) {
            $(".results-box").show();
            $(".rate-info").html('');
            $(".conversion-results").html('Please make sure that the currencies are not the same');
            return false
        } else return true
    }

    /**
     * executes API call for currency exchange
     */

    function convertCurrency(values) {
        let trueOrFalse = testInputs(values);
        if (!trueOrFalse) {
            return;
        }

        const conversionCall = $.ajax({
            url: `${API_root}convert?access_key=${access_key}&from=${values.from}&to=${values.to}&amount=${values.amount}`,
            dataType: 'json'
        });

        /**
         * execute the conversion using the "convert" endpoint, and then render it
         */
        conversionCall.done(function (json) {
            renderConversionResult(values, json);
        });

    };

    /**
     * renders conversion result to user including the base currency, amount to convert, and conversion result
     */
    function renderConversionResult(values, json) {
        $(".conversion-results").html(`${json.result} ${values.to}`)
        $(".rate-info").html(`Current Exchange Rate: 1 ${values.from} = ${json.info.rate} ${values.to}`)
        $(".results-box").show();
    }

    /**
     * listens for form submission and executes conversion 
     */
    function handleFormSubmit(event) {
        $("#conversion-form").submit((function (event) {
            event.preventDefault();

            //update to, from, & amount
            const values = buildCurrencyValues();
            convertCurrency(values);
        }));
    }

    /**
     * Create object with updated conversion values (to, from, & amount)
     */
    function buildCurrencyValues() {
        return {
            from: $("#dropdown-1 option:selected").val(),
            to: $("#dropdown-2 option:selected").val(),
            amount: $("#conversion-amount").val()
        };
    }

    /**
     * style inputs
     */
    formatDropDowns();

    /**
     * executes event listeners
     */
    function registerEvents() {
        handleFormSubmit();
    }
    registerEvents();
});