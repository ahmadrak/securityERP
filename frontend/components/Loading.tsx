import React from 'react'

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[60vh]">
              <div className="flex flex-col items-center gap-3">

              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="text-gray-500 text-sm">Loading data...</p>

  </div>
</div>
  )
}
