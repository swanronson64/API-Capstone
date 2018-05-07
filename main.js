'use strict';

$(document).ready(function () {
    const access_key = '0b60243c6e779ce451127759d8b9c8fe';

    // access object of all available currencies
    $.ajax({
        url: 'https://data.fixer.io/api/symbols' + '?access_key=' + access_key,
        dataType: 'jsonp',
        success: function (json) {
            let currencyAcronyms = Object.keys(json.symbols);
            let currencyNames = Object.values(json.symbols);
    // render dropdown lists of available currencies       
            function renderList(array) {
                $(array).html('');
                for (let i = 0; i < array.length; i++) {
                    let dropdownOption = $("<option>", {
                        value: array[i],
                    }).text(array[i]);
                    $(".populated-currency-list").append(dropdownOption);
                }
            }
            renderList(currencyAcronyms);
        }
    });
    // self-explanatory
    function convertCurrency() {
        // set endpoint
        let endpoint = 'convert';
        // define from currency, to currency, and amount
        let from = $("#dropdown-1 option:selected").text();
        let to = $("#dropdown-2 option:selected").text();
        let amount = $("#conversion-amount").val();
        //test for invalid characters
        function testNumberInput() {
            if (amount !== Number || !(amount > 0)) {
                $(".conversion-results").html(`Conversion failed. Please try again, using only positive integers, and no commas or currency symbols.`)
            }
        }
        testNumberInput();
        // execute the conversion using the "convert" endpoint:
        $.ajax({
            url: 'https://data.fixer.io/api/' + endpoint + '?access_key=' + access_key + '&from=' + from + '&to=' + to + '&amount=' + amount,
            dataType: 'jsonp',
            success: function (json) {
                // access json data and render it in the DOM
                function renderConversionResult(json) {
                    let rate = json.info.rate;
                    $(".conversion-results").html(`${amount} ${from} equals ${json.result} ${to} at a rate of ${rate}`)
                }
                renderConversionResult(json);
            }
        });
    };
    // event listener for the "Convert!" button
    function handleConvertButtonClick(event) {
        $(".convert-button").on('click', (function (event) {
            event.preventDefault();
            convertCurrency();
        }));
    }
    // executes event listeners
    function registerEvents() {
        handleConvertButtonClick();
    }
    registerEvents();
});