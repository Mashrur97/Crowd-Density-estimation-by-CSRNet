import { useState, useRef } from "react"
import ImageAnalyzer from "./components/ImageAnalyzer"
import VideoAnalyzer from "./components/VideoAnalyzer"
import Particles from "./components/reactbits/Particles"
import BlurText from "./components/reactbits/BlurText"
import CountUpStat from "./components/CountUpStat"
import { motion } from "motion/react"
import { FaImage, FaVideo, FaExclamationTriangle } from "react-icons/fa"

const stats = [
  { value: "9.43", label: "MAE on ShanghaiTech B" },
  { value: "73", label: "Epochs Trained" },
  { value: "99ms", label: "Avg Inference Time" },
  { value: "VGG-16", label: "Backbone Architecture" },
]

const features = [
  {
    icon: FaImage,
    title: "Image Analysis",
    desc: "Upload any overhead crowd image and get an instant density heatmap with headcount estimation."
  },
  {
    icon: FaVideo,
    title: "Video Analytics",
    desc: "Process crowd videos frame by frame. Get peak count, average density, and a downloadable CSV report."
  },
  {
    icon: FaExclamationTriangle,
    title: "Threshold Alerts",
    desc: "Set a custom crowd limit. The system flags frames where capacity is exceeded in real time."
  },
]

const steps = [
  { n: "01", title: "Upload", desc: "Drop an image or video into the analyzer" },
  { n: "02", title: "Analyze", desc: "CSRNet processes and generates a density map" },
  { n: "03", title: "Export", desc: "Download your CSV report and processed video" },
]

export default function App() {
  const [tab, setTab] = useState("image")
  const analyzerRef = useRef(null)

  const scrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-x-hidden">
      {/* Particles background */}
      <div className="fixed inset-0 z-0">
        <Particles
          particleCount={200}
          particleSpread={8}
          speed={0.05}
          particleColors={["#3b82f6", "#6366f1", "#93c5fd"]}
          alphaParticles={false}
          particleBaseSize={200}
          sizeRandomness={0.5}
          moveParticlesOnHover={true}
          particleHoverFactor={0.3}
          cameraDistance={15}
        />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-gray-950/60 backdrop-blur-md">
          <BlurText
            text="CrowdSense"
            className="text-xl font-bold tracking-tight"
            delay={60}
            animateBy="letters"
            direction="top"
            gradient={true}
          />
          <button
            onClick={scrollToAnalyzer}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Try it →
          </button>
        </nav>

        {/* Hero */}
        <section className="px-8 pt-24 pb-20 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-medium tracking-widest text-blue-400 uppercase mb-6 border border-blue-400/30 px-3 py-1 rounded-full">
              AI-Powered Crowd Analysis
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Know exactly{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                how many people
              </span>{" "}
              are there
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              CSRNet-powered crowd density estimation. Upload an image or video
              and get instant headcount, heatmaps, and exportable analytics.
            </p>
            <button
              onClick={scrollToAnalyzer}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
            >
              Start Analyzing
            </button>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="px-8 pb-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ value, label }, i) => (
              <CountUpStat key={label} value={value} label={label} delay={i} />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-8 pb-20 max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What it does
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon className="text-3xl text-blue-400" />
                <h3 className="text-lg font-semibold mt-3 mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-8 pb-20 max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {steps.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                className="flex-1 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <span className="text-4xl font-bold text-white/10">{n}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 text-gray-600 text-xl z-10">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Analyzer */}
        <section ref={analyzerRef} className="px-8 pb-24 max-w-5xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-center mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Try it yourself
          </motion.h2>
          <p className="text-gray-500 text-sm text-center mb-8">No account needed</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("image")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "image"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Image
            </button>
            <button
              onClick={() => setTab("video")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Video
            </button>
          </div>

          {tab === "image" ? <ImageAnalyzer /> : <VideoAnalyzer />}
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 px-8 py-6 text-center text-gray-600 text-xs">
          Built with CSRNet · ShanghaiTech Part B · MAE 9.43
        </footer>
      </div>
    </div>
  )
}