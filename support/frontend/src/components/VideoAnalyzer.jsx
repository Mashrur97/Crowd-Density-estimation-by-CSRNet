import { useState, useRef } from "react"
import { motion } from "motion/react"
import BorderGlow from "./reactbits/BorderGlow"
import CountUp from "./CountUp"

const API = "http://127.0.0.1:8000"

export default function VideoAnalyzer() {
  const [preview, setPreview] = useState(null)
  const [threshold, setThreshold] = useState(50)
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
      form.append("threshold", threshold)
      const res = await fetch(`${API}/predict/video`, { method: "POST", body: form })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError("Failed to connect to backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
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
          <p className="text-gray-400">Click to upload a crowd video</p>
          <p className="text-gray-600 text-sm mt-1">MP4 supported</p>
          <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        </div>
      </BorderGlow>

      {preview && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <video src={preview} controls className="rounded-xl max-h-48 w-full" />
        </motion.div>
      )}

      <div className="mt-6">
        <label className="text-sm text-gray-400">
          Crowd Threshold: <span className="text-white font-medium">{threshold}</span>
        </label>
        <input
          type="range" min="10" max="500" step="10"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full mt-2 accent-blue-500"
        />
      </div>

      {preview && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Processing... this may take a while" : "Process Video"}
        </button>
      )}

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {result && (
        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Peak Count", value: result.peak },
              { label: "Avg Count", value: result.avg },
              { label: "Status", value: result.alert === "NORMAL" ? "Normal" : "Alert" },
            ].map(({ label, value }, i) => {
              const isAlert = result.alert !== "NORMAL" && label === "Status"
              return (
                <motion.div
                  key={label}
                  className="bg-gray-900 rounded-xl p-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className={`text-2xl font-bold mt-1 ${isAlert ? "text-red-400" : "text-blue-400"}`}>
                    {label === "Status" ? value : <CountUp value={value} />}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Processed Video</p>
            <video
              src={`${API}${result.video_url}`}
              controls
              className="rounded-xl w-full"
            />
          </div>

          
           <a href={`data:text/csv;charset=utf-8,frame,count\n${result.frame_counts.map(r => `${r.frame},${r.count}`).join("\n")}`}
            download="crowd_report.csv"
            className="inline-block px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Download CSV Report
          </a>
        </motion.div>
      )}
    </div>
  )
}