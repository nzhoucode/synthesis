/** Renders a loading modal. */
export default function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full border-4 border-gray-400 border-t-transparent h-12 w-12 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">Processing...</p>
      </div>
    </div>
  )
}