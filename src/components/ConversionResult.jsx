import { motion } from 'framer-motion';

function ConversionResult({ amount, fromCurrency, convertAmount, toCurrency }) {
    if (convertAmount === null) return null;

    return (
        <motion.div
            className='mt-8 p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm text-center'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className='text-xl font-semibold text-zinc-200'>
                {amount} {fromCurrency} ={' '}
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold'>
                    {convertAmount.toFixed(2)} {toCurrency}
                </span>
            </h2>
        </motion.div>
    );
}

export default ConversionResult;