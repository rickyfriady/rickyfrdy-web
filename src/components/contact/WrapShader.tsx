import { Warp } from '@paper-design/shaders-react'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LIGHT_COLORS = ['#eef2f8', '#b0c8e8', '#dde8f8', '#6b9bcc']
const DARK_COLORS = ['#0b1a14', '#102510', '#16301e', '#2a5c3a']

export default function WrapShader() {
  const reducedMotion = useReducedMotion()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    setIsDark(root.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <Warp
      className="absolute inset-0"
      style={{ width: '100%', height: '100%' }}
      colors={isDark ? DARK_COLORS : LIGHT_COLORS}
      speed={reducedMotion ? 0 : 0.4}
      distortion={0.2}
      swirl={0.8}
      swirlIterations={8}
      softness={1.5}
      proportion={0.5}
      shapeScale={0.15}
      shape="edge"
    />
  )
}
