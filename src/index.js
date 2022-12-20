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

refs.searchInput.addEventListener('input', debounce(onSearch, 300));

function onSearch(e) {
  searchQuery = e.target.value;
  fetchCountries(searchQuery).then(data => console.log(data));
}

// Notify.failure('Qui timide rogat docet negare');
// Notify.info('Cogito ergo sum');
