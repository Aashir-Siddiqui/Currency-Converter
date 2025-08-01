import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { IoSwapHorizontal } from 'react-icons/io5';

function CurrencySelector({ currencies, fromCurrency, setFromCurrency, toCurrency, setToCurrency, loading }) {
    return (
        <div className='flex gap-[9px] sm:gap-6 mb-8 items-end justify-center'>
            <div className='w-[40%]'>
                <label className='block mb-2 text-sm font-semibold text-zinc-300'>From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={loading}>
                    <SelectTrigger className='cursor-pointer w-full bg-zinc-900 border-zinc-600 text-white rounded-xl p-3 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm'>
                        <SelectValue placeholder='Select currency' />
                    </SelectTrigger>
                    <SelectContent className='bg-zinc-900 border-zinc-700 text-white rounded-xl shadow-lg max-h-60'>
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

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                    variant='outline'
                    size='icon'
                    onClick={() => {
                        setFromCurrency(toCurrency);
                        setToCurrency(fromCurrency);
                    }}
                    className='cursor-pointer border-zinc-600 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-colors rounded-xl'
                    disabled={loading}
                >
                    <IoSwapHorizontal className='h-5 w-5' />
                </Button>
            </motion.div>

            <div className='w-[40%]'>
                <label className='block mb-2 text-sm font-semibold text-zinc-300'>To</label>
                <Select value={toCurrency} onValueChange={setToCurrency} disabled={loading}>
                    <SelectTrigger className='cursor-pointer w-full bg-zinc-900 border-zinc-600 text-white rounded-xl p-3 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm'>
                        <SelectValue placeholder='Select currency' />
                    </SelectTrigger>
                    <SelectContent className='bg-zinc-900 border-zinc-700 text-white rounded-xl shadow-lg max-h-60'>
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
    );
}

export default CurrencySelector;