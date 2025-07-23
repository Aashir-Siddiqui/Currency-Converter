import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { currencyConverter, getCurrencyList } from './api/Api';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Button } from './components/ui/button';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [convertAmount, setConvertAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [debouncedAmount] = useDebounce(amount, 300);

  useEffect(() => {
    getCurrencyList()
      .then((res) => {
        const list = res.data.supported_codes.map(([code, name]) => ({ code, name }));
        setCurrencies(list);
      })
      .catch(() => setError("Failed to load currencies"));
  }, []);

  useEffect(() => {
    if (debouncedAmount && debouncedAmount > 0 && fromCurrency && toCurrency) {
      handleConvert();
    } else if (!debouncedAmount || debouncedAmount < 0) {
      setConvertAmount(null);
    }
  }, [debouncedAmount, fromCurrency, toCurrency]);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!debouncedAmount || debouncedAmount <= 0) {
        toast.error("Enter, valid amount! (Greater than 0)");
        setLoading(false);
        setConvertAmount(null);
        return;
      }
      const res = await currencyConverter(fromCurrency, toCurrency, debouncedAmount);
      const data = res.data;
      setConvertAmount(data.conversion_result);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error fetching conversion rate");
      toast.error(error.message || "Error, try again!");
      setLoading(false);
      setConvertAmount(null);
    }
  };

  return (
    <section className='flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 min-h-screen px-4 py-8'>
      <motion.div
        className='bg-zinc-800 p-6 sm:p-8 rounded-3xl border border-zinc-700 shadow-xl w-full max-w-md text-white'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-200'>💱 Currency Converter</h1>

        {error && (
          <motion.p
            className='text-red-400 mb-6 text-center font-medium'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <div className='mb-6'>
          <label className='block mb-2 text-sm font-semibold text-zinc-300'>Amount</label>
          <Input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full bg-zinc-900 border-zinc-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition-all'
            placeholder='Enter amount'
          />
        </div>

        {currencies.length === 0 && !error ? (
          <div className='flex gap-4 mb-6'>
            <div className='w-1/2'>
              <label className='block mb-2 text-sm font-semibold text-zinc-300'>From</label>
              <div className='w-full p-3 rounded-lg bg-zinc-900 border border-zinc-600 animate-pulse h-12'></div>
            </div>
            <div className='w-1/2'>
              <label className='block mb-2 text-sm font-semibold text-zinc-300'>To</label>
              <div className='w-full p-3 rounded-lg bg-zinc-900 border border-zinc-600 animate-pulse h-12'></div>
            </div>
          </div>
        ) : (
          <div className='flex gap-4 mb-6 items-end'>
            <div className='w-[40%]'>
              <label className='block mb-2 text-sm font-semibold text-zinc-300'>From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className='w-full bg-zinc-900 border-zinc-600 text-white rounded-lg p-3 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all'>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-900 border-zinc-700 text-white rounded-lg shadow-lg max-h-60'>
                  {currencies.map((cur) => (
                    <SelectItem
                      key={cur.code}
                      value={cur.code}
                      className='px-4 py-3 hover:bg-zinc-800 hover:text-blue-300 cursor-pointer transition-colors'
                    >
                      {`${cur.code} - ${cur.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
              }}
              className='border-zinc-600 text-lg text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-colors rounded-lg'
            >
              ⇆
            </Button>

            <div className='w-[40%]'>
              <label className='block mb-2 text-sm font-semibold text-zinc-300'>To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className='w-full bg-zinc-900 border-zinc-600 text-white rounded-lg p-3 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all'>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent className='bg-zinc-900 border-zinc-700 text-white rounded-lg shadow-lg max-h-60'>
                  {currencies.map((cur) => (
                    <SelectItem
                      key={cur.code}
                      value={cur.code}
                      className='px-4 py-3 hover:bg-zinc-800 hover:text-blue-300 cursor-pointer transition-colors'
                    >
                      {`${cur.code} - ${cur.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Button
          onClick={handleConvert}
          className='w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg'
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </Button>

        {convertAmount !== null && (
          <motion.div
            className='mt-8 text-center'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-xl font-semibold text-zinc-200'>
              {amount} {fromCurrency} ={' '}
              <span className='text-green-400 font-bold'>{convertAmount.toFixed(2)} {toCurrency}</span>
            </h2>
          </motion.div>
        )}
      </motion.div>
      <ToastContainer position='top-right' autoClose={3000} theme='dark' />
    </section>
  );
}

export default App;