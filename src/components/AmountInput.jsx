import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { LuMic } from "react-icons/lu";
import { FaMicrophoneSlash } from "react-icons/fa6";
import { evaluate } from "mathjs";
import nlp from "compromise";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";

function AmountInput({
  amountInput,
  setAmountInput,
  setAmount,
  isListening,
  setIsListening,
  currencies,
  setFromCurrency,
  setToCurrency,
}) {
  const [debouncedInput] = useDebounce(amountInput, 500);

  useEffect(() => {
    try {
      if (debouncedInput) {
        const evaluated = evaluate(debouncedInput);
        setAmount(evaluated);
      } else {
        setAmount("");
      }
    } catch {
      toast.error(
        "Invalid expression! Use numbers and operators like +, -, *, /"
      );
      setAmount("");
    }
  }, [debouncedInput, setAmount]);

  const handleAmountChange = (e) => {
    setAmountInput(e.target.value);
  };

  const startVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast.error(
        "Voice input not supported in this browser. Use Chrome or Edge."
      );
      return;
    }
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const doc = nlp(transcript);

      const amountMatch = doc.numbers().get()[0];
      let amountValue = amountMatch ? doc.numbers().toNumber().get()[0] : null;

      const words = transcript.split(" ");
      const toIndex = words.indexOf("to");
      const fromCurrency = words
        .slice(0, toIndex)
        .find((word) => /^[A-Z]{3}$/.test(word.toUpperCase()));
      const toCurrency = words
        .slice(toIndex + 1)
        .find((word) => /^[A-Z]{3}$/.test(word.toUpperCase()));

      if (
        amountValue &&
        fromCurrency &&
        toCurrency &&
        currencies.some((cur) => cur.code === fromCurrency.toUpperCase()) &&
        currencies.some((cur) => cur.code === toCurrency.toUpperCase())
      ) {
        setAmountInput(amountValue.toString());
        setAmount(amountValue);
        setFromCurrency(fromCurrency.toUpperCase());
        setToCurrency(toCurrency.toUpperCase());
      } else {
        toast.error(
          'Could not understand voice input. Say, e.g., "Convert 100 USD to PKR"'
        );
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      toast.error("Voice recognition failed. Please try again.");
      setIsListening(false);
    };
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="mb-8">
      <label className="block mb-2 text-sm font-semibold text-zinc-300">
        Amount
      </label>
      <div className="flex gap-3">
        <Input
          type="text"
          value={amountInput}
          onChange={handleAmountChange}
          className="w-full bg-zinc-900 border-zinc-600 text-white rounded-xl p-3 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          placeholder="Enter amount or expression (e.g., 100 + 50)"
          aria-label="Amount or mathematical expression"
        />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={startVoiceInput}
            disabled={isListening}
            className="border-zinc-600 text-blue-400 cursor-pointer hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-colors rounded-xl"
          >
            {isListening ? (
              <LuMic className="h-5 w-5" />
            ) : (
              <FaMicrophoneSlash className="h-5 w-5" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default AmountInput;
