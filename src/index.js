import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let searchQuery = '';

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  searchQuery = e.target.value.trim();

  if (searchQuery === '') {
    clearCountryList();
    clearCountyInfo();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        clearCountryList();
        clearCountyInfo();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length === 1) {
        clearCountryList();
        appendCountyInfoMarkup(data);
        return;
      }

      clearCountyInfo();
      appendCountryListMarkup(data);
    })
    .catch(error => {
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function createCountryForListMarkup(countries) {
  return countries
    .map(
      ({ name, flags }) => `
    <li class="country-list-item">
      <img class="flag" src="${flags.png}" alt="flag of ${name.official}"}>
      <p>${name.official}</p>
    </li>
  `
    )
    .join('');
}

function createCountryMarkup(countries) {
  return countries
    .map(
      ({ name, flags, capital, population, languages }) => `
    <div>
      <div class="nameWrap">
        <img class="flag" src="${flags.png}" alt="flag of ${name.official}"}>
        <p class="name">${name.official}</p>
      </div>
      <p><span class="disc">Capital: </span>${capital}</p>
      <p><span class="disc">Population: </span>${population}</p>
      <p><span class="disc">Languages: </span>${Object.values(languages).map(
        item => ' ' + item
      )}</p>
    </div>`
    )
    .join('');
}

function appendCountryListMarkup(countries) {
  refs.countryList.innerHTML = createCountryForListMarkup(countries);
}

function appendCountyInfoMarkup(countries) {
  refs.countryInfo.innerHTML = createCountryMarkup(countries);
}

function clearCountryList() {
  if (refs.countryList.innerHTML) {
    refs.countryList.innerHTML = '';
  }
}

function clearCountyInfo() {
  if (refs.countryInfo.innerHTML) {
    refs.countryInfo.innerHTML = '';
  }
}
