import { useEffect, useRef } from 'react'
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'
import { useReducedMotion } from 'framer-motion'

export default function LandingParticleField() {
  const canvasRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let renderer
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (error) {
      console.warn('The landing-page background could not initialize WebGL.', error)
      return undefined
    }

    const scene = new Scene()
    const camera = new PerspectiveCamera(48, 1, 0.1, 100)
    camera.position.z = 18

    const pointsGroup = new Group()
    const pointsGeometry = new BufferGeometry()
    const lineGeometry = new BufferGeometry()
    const pointPositions = []
    const linePositions = []
    const pointCount = 112
    const points = []

    for (let index = 0; index < pointCount; index += 1) {
      const point = {
        x: (Math.random() - 0.5) * 22,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 3,
      }
      points.push(point)
      pointPositions.push(point.x, point.y, point.z)
    }

    for (let index = 0; index < points.length; index += 1) {
      let nearestIndex = -1
      let nearestDistance = 2.1
      for (let candidate = index + 1; candidate < points.length; candidate += 1) {
        const dx = points[index].x - points[candidate].x
        const dy = points[index].y - points[candidate].y
        const distance = Math.hypot(dx, dy)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = candidate
        }
      }
      if (nearestIndex !== -1) {
        linePositions.push(
          points[index].x, points[index].y, points[index].z,
          points[nearestIndex].x, points[nearestIndex].y, points[nearestIndex].z,
        )
      }
    }

    pointsGeometry.setAttribute('position', new Float32BufferAttribute(pointPositions, 3))
    lineGeometry.setAttribute('position', new Float32BufferAttribute(linePositions, 3))
    pointsGroup.add(new Points(
      pointsGeometry,
      new PointsMaterial({ color: '#a9a5ff', size: 0.055, transparent: true, opacity: 0.72, depthWrite: false }),
    ))
    pointsGroup.add(new LineSegments(
      lineGeometry,
      new LineBasicMaterial({ color: '#8c88db', transparent: true, opacity: 0.16, depthWrite: false }),
    ))
    scene.add(pointsGroup)

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (!width || !height) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    })
    resizeObserver.observe(canvas.parentElement)

    let frameId
    const renderFrame = () => {
      pointsGroup.rotation.z += 0.00012
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(renderFrame)
    }

    if (reduceMotion) {
      renderer.render(scene, camera)
    } else {
      frameId = window.requestAnimationFrame(renderFrame)
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      pointsGeometry.dispose()
      lineGeometry.dispose()
      pointsGroup.children.forEach(child => child.material.dispose())
      renderer.dispose()
    }
  }, [reduceMotion])

  return <canvas ref={canvasRef} className="landing-particle-field" aria-hidden="true" />
}
