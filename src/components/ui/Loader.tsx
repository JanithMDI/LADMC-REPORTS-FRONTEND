import React from "react"

interface LoaderProps {
  message?: string
  fullscreen?: boolean
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading", fullscreen = false }) => (
  <div
    className={
      fullscreen
        ? "fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70"
        : "flex items-center justify-center bg-white bg-opacity-70 rounded-lg py-12 my-4 shadow-lg"
    }
  >
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4"></div>
      <div className="text-lg font-semibold text-primary">
        {message}
      </div>
    </div>
  </div>
)

export default Loader
