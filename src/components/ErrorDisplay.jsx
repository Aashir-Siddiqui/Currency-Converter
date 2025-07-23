import { motion } from 'framer-motion';

function ErrorDisplay({ error }) {
    if (!error) return null;

    return (
        <motion.p
            className='text-red-400 mb-6 text-center font-medium bg-zinc-900 p-3 rounded-xl shadow-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {error}
        </motion.p>
    );
}

export default ErrorDisplay;