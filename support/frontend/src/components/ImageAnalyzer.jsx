import { useState, useRef } from "react"
import { motion } from "motion/react"
import BorderGlow from "./reactbits/BorderGlow"
import CountUp from "./CountUp"

const API = "http://127.0.0.1:8000"

export default function ImageAnalyzer() {
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!fileRef.current.files[0]) return
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", fileRef.current.files[0])
      const res = await fetch(`${API}/predict/image`, { method: "POST", body: form })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError("Failed to connect to backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <BorderGlow
        className="rounded-xl cursor-pointer"
        backgroundColor="#030712"
        borderRadius={12}
        colors={["#3b82f6", "#6366f1", "#3b82f6"]}
      >
        <div
          onClick={() => fileRef.current.click()}
          className="p-12 text-center"
        >
          <p className="text-gray-400">Click to upload a crowd image</p>
          <p className="text-gray-600 text-sm mt-1">JPG, PNG supported</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </BorderGlow>

      {preview && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={preview} alt="preview" className="rounded-xl max-h-64 object-contain" />
        </motion.div>
      )}

      {preview && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      )}

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {result && (
        <motion.div
          className="mt-6 grid grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="text-gray-400 text-sm mb-2">Original</p>
            <img src={preview} alt="original" className="rounded-xl w-full object-contain" />
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Density Map</p>
            <img
              src={`data:image/png;base64,${result.heatmap_b64}`}
              alt="heatmap"
              className="rounded-xl w-full object-contain"
            />
          </div>
          <div className="col-span-2">
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm">Estimated Count</p>
              <motion.p
                className="text-5xl font-bold text-blue-400 mt-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CountUp value={result.count} />
              </motion.p>
              <p className="text-gray-500 text-sm mt-1">people detected</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}