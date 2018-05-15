'use strict';

$(document).ready(function () {
    const access_key = '0b60243c6e779ce451127759d8b9c8fe';
    const API_root = 'https://data.fixer.io/api/';
    let from = "",
        to = "",
        amount = 0;

    /**
     * ajax request to access all available currencies
     */
    const symbolsCall = $.ajax({
        url: `${API_root}symbols?access_key=${access_key}`,
        dataType: 'json'
    });

    // STYLING
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

    function testInputs() {
        from = $("#dropdown-1").val();
        to = $("#dropdown-2").val();

        if (from == to) {
            $(".conversion-results").html('Please make sure that the currencies are not the same');
            return false
        } else return true
    }

    /**
     * executes API call for currency exchange
     */

    function convertCurrency() {
        let trueOrFalse = testInputs();
        if (!trueOrFalse) {
            return;
        }

        from = $("#dropdown-1").val();
        to = $("#dropdown-2").val();
        amount = $("#conversion-amount").val();

        const conversionCall = $.ajax({
            url: `${API_root}convert?access_key=${access_key}&from=${from}&to=${to}&amount=${amount}`,
            dataType: 'json'
        });

        /**
         * execute the conversion using the "convert" endpoint, and then render it
         */
        conversionCall.done(function (json) {
            renderConversionResult(json);
        });


    };

    /**
     * renders conversion result to user including the base currency, amount to convert, and conversion result
     */
    function renderConversionResult(json) {
        from = $("#dropdown-1 option:selected").val();
        to = $("#dropdown-2 option:selected").val();
        amount = $("#conversion-amount").val();
        $(".conversion-results").html(`${amount} ${from} equals ${json.result} ${to}.`)
    }

    /**
     * listens for form submission and executes conversion 
     */
    function handleFormSubmit(event) {
        $("#conversion-form").submit((function (event) {
            event.preventDefault();
            convertCurrency();
        }));
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