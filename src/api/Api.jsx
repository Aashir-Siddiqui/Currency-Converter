import axios from "axios";

const apiKey = "e82c35fd7af016798bd639bc";

const api = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${apiKey}`
});

export const currencyConverter = (fromCurrency, toCurrency, amount) => {
  return api.get(`/pair/${fromCurrency}/${toCurrency}/${amount}`);
};

export const getCurrencyList = () => {
  return api.get(`/codes`);
};
