import { useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import preloaderImage from '../../assets/preloader.png'

export default function Preloader() {
  const reduceMotion = useReducedMotion()
  const imageRef = useRef(null)

  useLayoutEffect(() => {
    if (!imageRef.current) return undefined

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(imageRef.current, { autoAlpha: 1, y: 0, scale: 1, rotation: 0 })
        return
      }

      gsap.timeline()
        .fromTo(
          imageRef.current,
          { autoAlpha: 0, y: 28, scale: 0.82, rotation: -6 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: 'back.out(1.7)',
          },
        )
        .to(imageRef.current, {
          scale: 1.035,
          rotation: 1.5,
          duration: 1.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
    })

    return () => context.revert()
  }, [reduceMotion])

  return (
    <motion.div
      role="status"
      aria-label="Loading MiTRAA-Edu"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: reduceMotion ? 0.15 : 0.75, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 45%, #fff 0%, #f7f6ff 52%, #eeedff 100%)',
      }}
    >
      <div style={{ position: 'relative', display: 'grid', justifyItems: 'center', gap: 20 }}>
        <img
          ref={imageRef}
          src={preloaderImage}
          alt="MiTRAA student learning"
          style={{ width: 'min(62vw, 270px)', height: 'auto' }}
        />
        <div
          aria-hidden="true"
          style={{
            width: 148,
            height: 3,
            overflow: 'hidden',
            borderRadius: 999,
            background: 'rgba(96,88,225,0.12)',
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0.01 : 1.35, ease: [0.65, 0, 0.35, 1] }}
            style={{
              height: '100%',
              borderRadius: 999,
              background: 'linear-gradient(90deg, #a59fff, #6058e1)',
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
