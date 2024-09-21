import axios from 'axios';

// Instance for the first API
const countryCodeApi = axios.create({
  baseURL: 'https://freeipapi.com/api/json',
});

// Instance for the second API
const holidaysApi = axios.create({
  baseURL: 'https://date.nager.at/api/v3',
});

export { countryCodeApi, holidaysApi };