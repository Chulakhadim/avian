import { FC } from 'react'
import { useLocal } from 'web-utils'
import { motion } from 'framer-motion'
export const ProgressBar: FC<{ percent?: number }> = ({ percent }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1">
      <motion.div
        className="avian-green3 h-1 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{
          repeat: Infinity,
          type: 'tween',
          duration: 1.5,
          repeatType: 'loop',
        }}
      ></motion.div>
    </div>
  )
}
