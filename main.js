/// <reference path="jquery-3.6.1.js" />
"use strict";

$(document).ready(() => {
    const allCountries = $("#allCountries");
    const searchButton = $("#searchButton");
    const countriesBody = $("#countriesBody");
    const countriesBodyTable = $("#countriesBodyTable");
    const regionBodyTable = $("#regionBodyTable");
    const currencyTable = $("#currencyTable");

    allCountries.on("click", displayCountriesStatics);
    searchButton.on("click", displaySearchedCountries);

    async function displayCountriesStatics() {
        const countries = await getJson("https://restcountries.com/v3.1/all");
        showCountriesStatics(countries);
    }

    async function getJson(url) {
        const response = await $.getJSON(url);
        return response;
    }

    function showCountriesStatics(countries) {
        const size = countries.length;
        let html = "";

        let sum = 0;
        for (let country of countries) {
            sum += country.population;
        }
        const avg = sum / size;

        html += `Total countries result: ${size} <br>
        Total Countries Population: ${sum}<br>
        Average Population: ${avg}<br>`;

        countriesBody.html(html);
    }

    async function displaySearchedCountries() {
        const userSearchInput = $("#searchInput");
        let searchValue = userSearchInput.val();
        searchValue = searchValue.toLowerCase();

        const countries = await getJson(`https://restcountries.com/v3.1/name/${searchValue}`);

        showCountriesStatics(countries);
        displayCitizens(countries);
        displayRegion(countries);
        displayCurrencies(countries);
    }

    function displayCitizens(countries) {
        let html = `<table class="centered bordered">
        <thead>
        <tr>
        <th>Country Name</th>
        <th>Number of citizens</th>
        </tr>
        </thead>
        <tbody>`;

        for (let country of countries) {
            html += `
            <tr>
                <td>${country.name.official}</td>
                <td>${country.population}</td>
            </tr>`;
        }

        html += `</tbody></table>`;
        countriesBodyTable.html(html);
    }

    function displayRegion(countries) {
        let html = `<table class="centered bordered">
        <thead>
        <tr>
        <th>Region</th>
        <th>Number of countries</th>
        </tr>
        </thead>
        <tbody>`;

        for (let country of countries) {
            const searchedCountriesRegion = countries.filter(countryTmp => countryTmp.region === country.region);
            if (searchedCountriesRegion.length !== 0) {
                html += `
                <tr>
                    <td>${country.region}</td>
                    <td>${searchedCountriesRegion.length}</td>
                </tr>`;
                countries = countries.filter(countryTmp => countryTmp.region != country.region);
            }
        }

        html += `</tbody></table>`;
        regionBodyTable.html(html);
    }

    function displayCurrencies(countries) {
        let html = `<table class="centered bordered">
        <thead>
        <tr>
        <th>Currency</th>
        <th>Number of countries</th>
        </tr>
        </thead>
        <tbody>`;

        const map = new Map();
        for (const country of countries) {
            for (const currencyName in country.currencies) {
                if (!map.has(currencyName)) {
                    map.set(currencyName, 1);
                }
                else {
                    const count = map.get(currencyName);
                    map.set(currencyName, count + 1);
                }
            }
        }

        for(const item of map) {
            html += `
                <tr>
                    <td>${item[0]}</td>
                    <td>${item[1]}</td>
                </tr>
            `;
        }

        html += `</tbody></table>`;

        currencyTable.innerHTML = html;

    }

})();