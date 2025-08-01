import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { currencyConverter, getCurrencyList } from "./api/Api";
import { useDebounce } from "use-debounce";
import AmountInput from "./components/AmountInput";
import CurrencySelector from "./components/CurrencySelector";
import ConversionResult from "./components/ConversionResult";
import ErrorDisplay from "./components/ErrorDisplay";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import logo from "./assets/logo.png";

function App() {
  const [amount, setAmount] = useState(1);
  const [amountInput, setAmountInput] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [reset, setReset] = useState(null);
  const [convertAmount, setConvertAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const [debouncedAmount] = useDebounce(amount, 300);

  useEffect(() => {
    getCurrencyList()
      .then((res) => {
        const list = res.data.supported_codes.map(([code, name]) => ({
          code,
          name,
        }));
        setCurrencies(list);
      })
      .catch(() => setError("Failed to load currencies"));
  }, []);

  useEffect(() => {
    if (debouncedAmount && debouncedAmount > 0 && fromCurrency && toCurrency) {
      handleConvert();
    } else if (!debouncedAmount || debouncedAmount <= 0) {
      setConvertAmount(null);
    }
  }, [debouncedAmount, fromCurrency, toCurrency]);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!debouncedAmount || debouncedAmount <= 0) {
        toast.error("Enter a valid amount! (Greater than 0)");
        setLoading(false);
        setConvertAmount(null);
        return;
      }
      const res = await currencyConverter(
        fromCurrency,
        toCurrency,
        debouncedAmount
      );
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

  const handleReset = () => {
    setAmountInput("");
    setAmount(0);
    setFromCurrency("USD");
    setToCurrency("PKR");
    setConvertAmount(null);
    setError(null);
    toast.info("Form reset to default values");
  };

  return (
    <section className="flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 min-h-screen px-4 py-12">
      <motion.div
        className="bg-zinc-800 p-8 sm:p-10 rounded-3xl border border-zinc-700 shadow-2xl w-full max-w-lg text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center mb-8">
          <motion.img
            src={logo}
            alt="Currency Converter Logo"
            className="h-10 w-10 sm:h-14 sm:w-14 mr-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-100 tracking-tight">
            Currency Converter
          </h1>
        </div>

        <ErrorDisplay error={error} />

        <AmountInput
          amountInput={amountInput}
          setAmountInput={setAmountInput}
          setAmount={setAmount}
          isListening={isListening}
          setIsListening={setIsListening}
          currencies={currencies}
          setFromCurrency={setFromCurrency}
          setToCurrency={setToCurrency}
        />

        {currencies.length === 0 && !error ? (
          <div className="flex gap-6 mb-8">
            <div className="w-[40%] sm:w-1/2">
              <label className="block mb-2 text-sm font-semibold text-zinc-300">
                From
              </label>
              <div className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-600 animate-pulse h-12"></div>
            </div>
            <div className="w-[40%] sm:w-1/2">
              <label className="block mb-2 text-sm font-semibold text-zinc-300">
                To
              </label>
              <div className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-600 animate-pulse h-12"></div>
            </div>
          </div>
        ) : (
          <CurrencySelector
            currencies={currencies}
            fromCurrency={fromCurrency}
            setFromCurrency={setFromCurrency}
            toCurrency={toCurrency}
            setToCurrency={setToCurrency}
            loading={loading}
          />
        )}

        <div className="flex gap-4 mt-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              onClick={handleConvert}
              className="cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Converting..." : "Convert"}
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              onClick={handleReset}
              className="cursor-pointer w-full py-3 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              Reset
            </Button>
          </motion.div>
        </div>

        <ConversionResult
          amount={amount}
          fromCurrency={fromCurrency}
          convertAmount={convertAmount}
          toCurrency={toCurrency}
        />
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </section>
  );
}

export default App;
