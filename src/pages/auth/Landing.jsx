import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { useAuth } from '../../contexts/AuthContext'
import { ROLE_DASHBOARD_PATH } from '../../data/mockData'
import heroVideo from '../../assets/hero-video.mp4'
import { faqs, featureCategories, platformPillars } from './landingFeatures'
import './Landing.css'
import 'lenis/dist/lenis.css'

const LandingParticleField = lazy(() => import('./LandingParticleField'))
const MotionBox = motion.create(Box)
const MotionPaper = motion.create(Paper)
gsap.registerPlugin(ScrollTrigger)

function DeferredParticleField() {
  const [isNearViewport, setIsNearViewport] = useState(false)
  const fieldRef = useRef(null)

  useEffect(() => {
    if (!fieldRef.current) return undefined
    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '240px 0px' })
    observer.observe(fieldRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={fieldRef} className="landing-particle-field-shell" aria-hidden="true">
      {isNearViewport && <Suspense fallback={null}><LandingParticleField /></Suspense>}
    </div>
  )
}

const releaseFilters = ['All roadmap stages', 'Phase 1', 'Planned & future']
const featuredCategoryIds = ['institution', 'operations', 'teaching', 'assessments']

const pillarIcons = {
  EduOS: AccountBalanceRoundedIcon,
  LearnAI: AutoAwesomeRoundedIcon,
  'Assessment Studio': FactCheckRoundedIcon,
  PracticePod: MenuBookRoundedIcon,
  ExamShield: FactCheckRoundedIcon,
  GovConnect: GroupsRoundedIcon,
  'Research & Innovation Lab': ScienceRoundedIcon,
}

const featureIcons = [
  SchoolRoundedIcon,
  AssignmentRoundedIcon,
  CalendarMonthRoundedIcon,
  PeopleAltRoundedIcon,
  LightbulbRoundedIcon,
  ChatBubbleRoundedIcon,
  SavingsRoundedIcon,
  SecurityRoundedIcon,
  ScienceRoundedIcon,
  TrendingUpRoundedIcon,
  FactCheckRoundedIcon,
  MenuBookRoundedIcon,
]

function renderAnimatedLetters(text) {
  return Array.from(text).map((letter, index) => (
    <span className="landing-hero__title-letter" key={`${letter}-${index}`}>
      {letter === ' ' ? '\u00a0' : letter}
    </span>
  ))
}

function matchesRelease(status, filter) {
  if (filter === 'Phase 1') return status.toLowerCase().includes('phase 1')
  if (filter === 'Planned & future') {
    return /planned|later|future|phase 2|to be confirmed/i.test(status)
  }
  return true
}

export default function Landing() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const { isAuthenticated, user } = useAuth()
  const [search, setSearch] = useState('')
  const [releaseFilter, setReleaseFilter] = useState(releaseFilters[0])
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedCategories, setExpandedCategories] = useState(() => new Set())
  const [showAllCategories, setShowAllCategories] = useState(false)
  const pillarsRef = useRef(null)
  const lenisRef = useRef(null)
  const heroCopyRef = useRef(null)
  const [headerOnDarkSection, setHeaderOnDarkSection] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_DASHBOARD_PATH[user.role] || '/')
    }
  }, [isAuthenticated, user, navigate])

  useLayoutEffect(() => {
    const header = document.querySelector('.landing-header')
    if (!header) return undefined

    const updateHeaderTheme = () => {
      const markerY = Math.max(
        header.offsetHeight,
        header.getBoundingClientRect().bottom,
      ) + 1
      const isOverDarkSection = Array.from(
        document.querySelectorAll('[data-header-theme="dark"]'),
      ).some(section => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= markerY && bounds.bottom > markerY
      })

      setHeaderOnDarkSection(current => (
        current === isOverDarkSection ? current : isOverDarkSection
      ))
    }

    updateHeaderTheme()
    window.addEventListener('scroll', updateHeaderTheme, { passive: true })
    window.addEventListener('resize', updateHeaderTheme)

    return () => {
      window.removeEventListener('scroll', updateHeaderTheme)
      window.removeEventListener('resize', updateHeaderTheme)
    }
  }, [])

  useEffect(() => {
    if (!pillarsRef.current || reduceMotion) return undefined

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis
    const syncScrollTrigger = () => ScrollTrigger.update()
    let frameId
    lenis.on('scroll', syncScrollTrigger)

    const animateScroll = time => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(animateScroll)
    }
    frameId = window.requestAnimationFrame(animateScroll)

    const context = gsap.context(() => {
      gsap.utils.toArray('.landing-pillar-card').forEach((card, index) => {
        gsap.fromTo(card, {
          autoAlpha: 0,
          x: index % 2 === 0 ? -90 : 90,
          filter: 'blur(8px)',
        }, {
          autoAlpha: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 45%',
            once: true,
          },
          onComplete: () => gsap.set(card, { clearProps: 'transform' }),
        })
      })
    }, pillarsRef)

    return () => {
      window.cancelAnimationFrame(frameId)
      context.revert()
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduceMotion])

  useLayoutEffect(() => {
    if (!heroCopyRef.current || reduceMotion) return undefined

    const context = gsap.context(() => {
      const sequence = gsap.timeline({ delay: 0.18 })
      sequence.fromTo('.landing-eyebrow', {
        autoAlpha: 0,
        y: 18,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
      })
      sequence.fromTo('.landing-hero__title-letter', {
        autoAlpha: 0,
        yPercent: 75,
        rotateX: -35,
        scale: 0.85,
      }, {
        autoAlpha: 1,
        yPercent: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.42,
        stagger: 0.025,
        ease: 'power4.out',
      }, '-=0.08')
      sequence.fromTo('.landing-hero__description', {
        autoAlpha: 0,
        y: 18,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.48,
        ease: 'power3.out',
      }, '+=0.08')
      sequence.fromTo('.landing-hero__actions .MuiButton-root', {
        autoAlpha: 0,
        y: 18,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.48,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.12')
      sequence.fromTo('.landing-hero__proof', {
        autoAlpha: 0,
        y: 14,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: 'power3.out',
      }, '-=0.1')
    }, heroCopyRef)

    return () => context.revert()
  }, [reduceMotion])

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase()
    return featureCategories
      .filter(category => activeCategory === 'all' || category.id === activeCategory)
      .filter(category => matchesRelease(category.status, releaseFilter))
      .map(category => ({
        ...category,
        visibleFeatures: category.features.filter(([title, description]) => (
          !query || `${title} ${description} ${category.title}`.toLowerCase().includes(query)
        )),
      }))
      .filter(category => category.visibleFeatures.length)
  }, [activeCategory, releaseFilter, search])

  const visibleCount = visibleCategories.reduce((total, category) => total + category.visibleFeatures.length, 0)
  const catalogIsFiltered = Boolean(search.trim()) || activeCategory !== 'all' || releaseFilter !== releaseFilters[0]
  const displayedCategories = showAllCategories || catalogIsFiltered
    ? visibleCategories
    : visibleCategories.filter(category => featuredCategoryIds.includes(category.id))
  const displayedCount = displayedCategories.reduce((total, category) => (
    total + (search.trim() || expandedCategories.has(category.id)
      ? category.visibleFeatures.length
      : Math.min(category.visibleFeatures.length, 3))
  ), 0)
  const totalFeatures = featureCategories.reduce((total, category) => total + category.features.length, 0)

  const toggleCategoryExpanded = id => {
    setExpandedCategories(current => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const scrollToCategory = id => {
    setActiveCategory(id)
    setSearch('')
    setReleaseFilter(releaseFilters[0])
    window.setTimeout(() => {
      const target = document.getElementById('feature-explorer')
      if (!target) return
      if (lenisRef.current) lenisRef.current.scrollTo(target)
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
    }, 0)
  }

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
  }

  return (
    <Box className="landing-page">
      <Box
        component="header"
        className={`landing-header${headerOnDarkSection ? '' : ' landing-header--light'}`}
      >
        <Container maxWidth="lg" className="landing-header__inner">
          <a className="landing-brand" href="#top" aria-label="MiTRAA-Edu home">
            <Box component="img" src="/logo.svg" alt="" />
            <span>Edu</span>
          </a>
          <Box component="nav" className="landing-nav" aria-label="Main navigation">
            <a href="#pillars">Platform</a>
            <a href="#feature-explorer">Features</a>
            <a href="#roadmap">Roadmap</a>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button className="landing-header__signin" onClick={() => navigate('/select-role')}>Sign in</Button>
            <Button
              className="landing-button landing-button--small"
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate('/register')}
            >
              Get started
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box component="main">
        <Box component="section" id="top" className="landing-hero" data-header-theme="dark">
          <video className="landing-hero__video" autoPlay muted loop playsInline aria-hidden="true">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <Container maxWidth="lg" className="landing-hero__inner">
            <Box ref={heroCopyRef} className="landing-hero__copy">
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="ONE CONNECTED EDUCATION VISION"
                className="landing-eyebrow"
              />
              <Typography
                component="h1"
                aria-label="Smarter School Operations. Connected Learning. Trusted Assessments."
              >
                <span className="landing-hero__title-line" aria-hidden="true">
                  {renderAnimatedLetters('Smarter School Operations.')}
                </span>
                <span className="landing-hero__title-line landing-hero__title-line--accent" aria-hidden="true">
                  {renderAnimatedLetters('Connected Learning.')}
                </span>
                <strong className="landing-hero__title-line landing-hero__title-line--accent" aria-hidden="true">
                  {renderAnimatedLetters('Trusted Assessments.')}
                </strong>
              </Typography>
              <Typography className="landing-hero__description">
                One connected platform for school operations, learning, assessment and family engagement.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} className="landing-hero__actions">
                <Button
                  className="landing-button"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  href="#feature-explorer"
                >
                  Explore features
                </Button>
                <Button className="landing-button landing-button--outline" href="#contact">
                  Request a demo / Contact us
                </Button>
              </Stack>
              <Stack direction="row" className="landing-hero__proof">
                <span className="landing-proof-dot" />
                <Typography>For the whole school community</Typography>
                <span>·</span>
                <Typography>{totalFeatures} capabilities</Typography>
              </Stack>
            </Box>

            <Box className="landing-hero__art" aria-label="An illustration of connected school and learning tools" role="img">
              <div className="landing-art-orbit landing-art-orbit--one" />
              <div className="landing-art-orbit landing-art-orbit--two" />
              <MotionPaper
                {...reveal}
                className="landing-hero-card"
                elevation={0}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <span className="landing-app-icon"><SchoolRoundedIcon /></span>
                    <Box>
                      <Typography className="landing-app-title">The learning hub</Typography>
                      <Typography className="landing-app-subtitle">A school, in sync</Typography>
                    </Box>
                  </Stack>
                  <span className="landing-live"><i /> CONNECTED</span>
                </Stack>
                <Box className="landing-art-progress">
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography className="landing-art-label">A clearer view of the week</Typography>
                      <Typography className="landing-art-heading">Every step adds up.</Typography>
                    </Box>
                    <AutoAwesomeRoundedIcon />
                  </Stack>
                  <Box className="landing-chart" aria-hidden="true">
                    {[36, 48, 42, 63, 56, 76, 61, 88, 73, 96, 67, 83, 72, 100].map((height, index) => (
                      <span key={index} style={{ '--bar-height': `${height}%`, '--bar-index': index }} />
                    ))}
                  </Box>
                  <Stack direction="row" justifyContent="space-between" className="landing-chart-labels">
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
                  </Stack>
                </Box>
                <Box className="landing-art-bottom">
                  <Box className="landing-art-next">
                    <span className="landing-art-miniicon landing-art-miniicon--violet"><MenuBookRoundedIcon /></span>
                    <Box><Typography className="landing-art-label">UP NEXT</Typography><Typography className="landing-art-item">Science · Lab work</Typography></Box>
                    <ArrowForwardRoundedIcon />
                  </Box>
                  <Box className="landing-art-next">
                    <span className="landing-art-miniicon landing-art-miniicon--green"><FactCheckRoundedIcon /></span>
                    <Box><Typography className="landing-art-label">PROGRESS</Typography><Typography className="landing-art-item">Goals in motion</Typography></Box>
                    <span className="landing-art-score">86%</span>
                  </Box>
                </Box>
              </MotionPaper>
              <MotionPaper
                className="landing-float-card landing-float-card--research"
                elevation={0}
                animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span><ScienceRoundedIcon /></span>
                <Box><b>Ideas into impact</b><small>Student Research & Innovation</small></Box>
              </MotionPaper>
              <MotionPaper
                className="landing-float-card landing-float-card--family"
                elevation={0}
                animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span><GroupsRoundedIcon /></span>
                <Box><b>Better connected</b><small>Students · Teachers · Families</small></Box>
              </MotionPaper>
              <div className="landing-art-spark landing-art-spark--one">✳</div>
              <div className="landing-art-spark landing-art-spark--two">✦</div>
            </Box>
          </Container>
        </Box>

        <Box component="section" id="pillars" className="landing-section landing-pillars" data-header-theme="dark" ref={pillarsRef}>
          <DeferredParticleField />
          <Container maxWidth="lg">
            <MotionBox {...reveal} className="landing-section-heading">
              <span className="landing-kicker">A connected platform</span>
              <Typography component="h2">Seven pillars. One school community.</Typography>
              <Typography>Explore the core products in one connected school platform.</Typography>
            </MotionBox>
            <Box className="landing-pillar-grid">
              {platformPillars.map((pillar, index) => {
                const Icon = pillarIcons[pillar.title]
                return (
                  <MotionPaper
                    key={pillar.title}
                    className={`landing-pillar-card landing-tone-${pillar.tone}`}
                    elevation={0}
                    whileHover={reduceMotion ? undefined : { scale: 1.015, transition: { duration: 0.22, ease: 'easeOut' } }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    onClick={() => scrollToCategory(pillar.category)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') scrollToCategory(pillar.category) }}
                    role="link"
                    tabIndex={0}
                    aria-label={`Explore ${pillar.title} features`}
                  >
                    <span className="landing-pillar-number">PILLAR {String(index + 1).padStart(2, '0')}</span>
                    <span className="landing-pillar-node" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="landing-pillar-icon"><Icon /></span>
                    <Typography component="h3">{pillar.title}</Typography>
                    <Typography>{pillar.description}</Typography>
                    <span className="landing-pillar-link">Explore capabilities <ArrowForwardRoundedIcon /></span>
                  </MotionPaper>
                )
              })}
            </Box>
          </Container>
        </Box>

        <Box component="section" id="feature-explorer" className="landing-section landing-explorer">
          <Container maxWidth="lg">
            <MotionBox {...reveal} className="landing-section-heading landing-section-heading--left">
              <span className="landing-kicker">The complete showcase</span>
              <Typography component="h2">Explore the capabilities</Typography>
              <Typography>Browse by area or release stage. Expand a group to see every capability.</Typography>
            </MotionBox>

            <Paper className="landing-filter-panel" elevation={0}>
              <TextField
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search features, topics or capabilities"
                aria-label="Search feature catalogue"
                className="landing-search"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>,
                }}
              />
              <Box className="landing-filter-row">
                <Box className="landing-filter-group" role="group" aria-label="Filter by roadmap stage">
                  <span className="landing-filter-label">ROADMAP</span>
                  {releaseFilters.map(filter => (
                    <button
                      type="button"
                      key={filter}
                      className={`landing-filter-chip${releaseFilter === filter ? ' is-active' : ''}`}
                      onClick={() => setReleaseFilter(filter)}
                      aria-pressed={releaseFilter === filter}
                    >
                      {filter}
                    </button>
                  ))}
                </Box>
                <Typography className="landing-results-count">
                  Showing <b>{displayedCount}</b> of {visibleCount} matches
                </Typography>
              </Box>
              <Box className="landing-category-filters" role="group" aria-label="Filter by feature area">
                {featureCategories.map(category => (
                  <button
                    type="button"
                    key={category.id}
                    className={`landing-category-chip${activeCategory === category.id ? ' is-active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                    aria-pressed={activeCategory === category.id}
                  >
                    <span className="landing-tab-number">{category.number}</span>
                    <span>{category.title.split('—')[0].split('&')[0].trim()}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`landing-category-chip landing-category-chip--all${activeCategory === 'all' ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                  aria-pressed={activeCategory === 'all'}
                >
                  <AppsRoundedIcon />
                  <span>All areas</span>
                </button>
              </Box>
            </Paper>

            {displayedCategories.length ? (
              <Box className="landing-feature-groups" id="feature-results">
                {displayedCategories.map((category, categoryIndex) => (
                  <Box
                    component="section"
                    id={`area-${category.id}`}
                    className={`landing-feature-group landing-feature-group--${category.id}`}
                    data-header-theme={category.id === 'examshield' ? 'dark' : undefined}
                    key={category.id}
                  >
                    <Box className="landing-feature-heading">
                      <Box>
                        <Typography className="landing-feature-number">{category.number} / FEATURE AREA</Typography>
                        <Typography component="h3">{category.title}</Typography>
                        <Typography>{category.description}</Typography>
                      </Box>
                      <Chip label={category.status} className="landing-status-chip" />
                    </Box>
                    <Box className="landing-feature-grid">
                      {category.visibleFeatures
                        .slice(0, search.trim() || expandedCategories.has(category.id) ? category.visibleFeatures.length : 3)
                        .map(([title, description], index) => {
                        const FeatureIcon = featureIcons[(index + categoryIndex * 3) % featureIcons.length]
                        const layoutVariant = index === 0 ? 0 : (index + categoryIndex) % 4 + 1
                        return (
                        <MotionPaper
                          {...reveal}
                          key={title}
                          className={`landing-feature-card landing-feature-card--${layoutVariant}`}
                          elevation={0}
                          style={{ '--feature-order': index + 1 }}
                          whileHover={reduceMotion ? undefined : {
                            y: -7,
                            scale: 1.018,
                            transition: { duration: 0.22, ease: 'easeOut' },
                          }}
                          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                          transition={{
                            ...reveal.transition,
                            delay: reduceMotion ? 0 : (index % 8) * 0.045,
                            duration: reduceMotion ? 0 : 0.76,
                          }}
                        >
                          <span className={`landing-feature-art landing-feature-art--${layoutVariant}`} aria-hidden="true">
                            {index === 0 ? (
                              <img src={`/animations/showcase-${categoryIndex % 4 + 1}.gif`} alt="" loading="lazy" />
                            ) : (
                              <>
                                <i /><i /><i /><b><FeatureIcon /></b>
                              </>
                            )}
                          </span>
                          <span className="landing-feature-mark"><FeatureIcon /></span>
                          <span className="landing-feature-index">{String(index + 1).padStart(2, '0')}</span>
                          <div className="landing-feature-copy">
                            <Typography component="h4">{title}</Typography>
                            <Typography>{description}</Typography>
                          </div>
                        </MotionPaper>
                        )
                      })}
                    </Box>
                    {!search.trim() && category.visibleFeatures.length > 3 && (
                      <button
                        type="button"
                        className="landing-feature-expand"
                        aria-expanded={expandedCategories.has(category.id)}
                        onClick={() => toggleCategoryExpanded(category.id)}
                      >
                        {expandedCategories.has(category.id)
                          ? 'Show less'
                          : `View all ${category.visibleFeatures.length} capabilities`}
                        <ExpandMoreRoundedIcon />
                      </button>
                    )}
                  </Box>
                ))}
                {!catalogIsFiltered && visibleCategories.length > featuredCategoryIds.length && (
                  <button
                    type="button"
                    className="landing-feature-areas-toggle"
                    aria-expanded={showAllCategories}
                    onClick={() => setShowAllCategories(value => !value)}
                  >
                    {showAllCategories ? 'Show fewer areas' : `View all ${visibleCategories.length} feature areas`}
                    <ExpandMoreRoundedIcon />
                  </button>
                )}
              </Box>
            ) : (
              <Paper className="landing-no-results" elevation={0} id="feature-results">
                <SearchRoundedIcon />
                <Typography component="h3">No matching features</Typography>
                <Typography>Try another search or clear a filter to see more of the showcase.</Typography>
                <Button onClick={() => { setSearch(''); setActiveCategory('all'); setReleaseFilter(releaseFilters[0]) }}>Clear filters</Button>
              </Paper>
            )}
          </Container>
        </Box>

        <Box component="section" id="benefits" className="landing-section landing-benefits">
          <Container maxWidth="lg">
            <MotionBox {...reveal} className="landing-section-heading">
              <span className="landing-kicker">Designed around people</span>
              <Typography component="h2">A better-connected school day for everyone.</Typography>
              <Typography>Useful tools for every part of the school community.</Typography>
            </MotionBox>
            <Box className="landing-role-grid">
              {[
                ['Students', 'Assignments, feedback, progress and practice.'],
                ['Teachers', 'Plan lessons, review work and guide learning.'],
                ['Parents', 'Follow progress and stay informed.'],
                ['Principals', 'See academic and school priorities.'],
                ['Management', 'Review institution and campus indicators.'],
                ['Exam Controllers', 'Future governed examination programmes.'],
              ].map(([name, description], index) => {
                const RoleIcon = [SchoolRoundedIcon, MenuBookRoundedIcon, GroupsRoundedIcon, AccountBalanceRoundedIcon, TrendingUpRoundedIcon, FactCheckRoundedIcon][index]
                return (
                <MotionPaper {...reveal} key={name} className={`landing-role-card landing-role-card--${index + 1}`} elevation={0} whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.22, ease: 'easeOut' } }} transition={{ ...reveal.transition, delay: reduceMotion ? 0 : index * 0.05 }}>
                  <span className={`landing-role-number landing-role-number--${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="landing-role-art" aria-hidden="true"><RoleIcon /></span>
                  <Typography component="h3">{name}</Typography>
                  <Typography>{description}</Typography>
                </MotionPaper>
                )
              })}
            </Box>
          </Container>
        </Box>

        <Box component="section" id="roadmap" className="landing-roadmap">
          <Container maxWidth="lg">
            <MotionBox {...reveal} className="landing-section-heading">
              <span className="landing-kicker">A clear product horizon</span>
              <Typography component="h2">Built in thoughtful stages.</Typography>
              <Typography>See what is planned now, next and for the future.</Typography>
            </MotionBox>
            <Box className="landing-roadmap-grid">
              {[
                ['01', 'Phase 1 foundation', 'Core school setup, operations and assessments.', 'foundation'],
                ['02', 'Planned extensions', 'Community connection, progress and practice.', 'planned'],
                ['03', 'Future & Phase 2', 'Optional integrations and governed exam services.', 'future'],
              ].map(([number, title, description, variant]) => (
                <MotionPaper {...reveal} key={number} className={`landing-roadmap-card landing-roadmap-card--${variant}`} elevation={0} whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}>
                  <span className="landing-roadmap-number">{number}</span>
                  <span className="landing-roadmap-status">{variant === 'foundation' ? 'IN BUILD' : variant === 'planned' ? 'NEXT UP' : 'ON THE HORIZON'}</span>
                  <Typography component="h3">{title}</Typography>
                  <Typography>{description}</Typography>
                  <span className="landing-roadmap-line" aria-hidden="true"><i /></span>
                </MotionPaper>
              ))}
            </Box>
            <Typography className="landing-roadmap-note">
              Plans may change. Future and optional features are not currently available.
            </Typography>
          </Container>
        </Box>

        <Box component="section" id="faq" className="landing-section landing-faq">
          <Container maxWidth="md">
            <MotionBox {...reveal} className="landing-section-heading">
              <span className="landing-kicker">A few helpful details</span>
              <Typography component="h2">Frequently asked questions</Typography>
            </MotionBox>
            <Box className="landing-faq-list">
              {faqs.map(item => (
                <Accordion key={item.question} disableGutters elevation={0} className="landing-faq-item">
                  <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                    <Typography component="h3">{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails><Typography>{item.answer}</Typography></AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" id="contact" className="landing-contact" data-header-theme="dark">
          <Container maxWidth="lg" className="landing-contact__inner">
            <MotionBox {...reveal} className="landing-contact-copy">
              <span className="landing-kicker landing-kicker--light">See what a connected school can be</span>
              <Typography component="h2">Let’s make room for better learning.</Typography>
              <Typography>Explore the MiTRAA-Edu portal or create an account to take the next step.</Typography>
            </MotionBox>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} className="landing-contact-actions">
              <Button className="landing-button landing-button--white" variant="contained" onClick={() => navigate('/register')} endIcon={<ArrowForwardRoundedIcon />}>
                Get started
              </Button>
              <Button className="landing-button landing-button--contact-outline" onClick={() => navigate('/select-role')}>
                Sign in to your portal
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Box component="footer" className="landing-footer">
        <Container maxWidth={false} className="landing-footer__inner">
          <Box className="landing-footer-main">
            <Box className="landing-footer-brand-column">
              <a className="landing-brand" href="#top" aria-label="MiTRAA-Edu home">
                <Box component="img" src="/logo.svg" alt="" />
                <span>Edu</span>
              </a>
              <Typography>
                Your big dreams deserve the right strategy. Fill out the form, pick a time that works for you, and let’s connect!
              </Typography>
            </Box>
            <Box className="landing-footer-link-column">
              <Typography component="h3">Services</Typography>
              <span>Generative AI Solutions</span>
              <span>Web &amp; Application Development</span>
              <span>Blockchain (Web3)</span>
              <span>Enterprise Agile Development</span>
              <span>Cyber Security</span>
              <span>Enterprise Technology &amp; Performance</span>
            </Box>
            <Box className="landing-footer-link-column">
              <Typography component="h3">Quick Links</Typography>
              <a href="#pillars">Portfolio</a>
              <a href="#feature-explorer">Case Study</a>
              <a href="#roadmap">Resource Augmentation</a>
              <a href="#contact">Careers</a>
              <a href="#contact">News &amp; Events</a>
            </Box>
            <Box className="landing-footer-social-column">
              <Typography component="h3">Follow Us</Typography>
              <Box className="landing-footer-socials" aria-label="Social media">
                <span className="landing-social-icon landing-social-icon--instagram" role="img" aria-label="Instagram"><InstagramIcon /></span>
                <span className="landing-social-icon landing-social-icon--linkedin" role="img" aria-label="LinkedIn"><LinkedInIcon /></span>
                <span className="landing-social-icon landing-social-icon--facebook" role="img" aria-label="Facebook"><FacebookIcon /></span>
                <span className="landing-social-icon landing-social-icon--x" role="img" aria-label="X"><XIcon /></span>
                <span className="landing-social-icon landing-social-icon--whatsapp" role="img" aria-label="WhatsApp"><WhatsAppIcon /></span>
              </Box>
            </Box>
          </Box>
          <Box className="landing-footer-locations">
            {[
              {
                zone: 'HEADQUARTERS',
                city: 'Bhubaneswar, Odisha',
                address: 'B-93, B.D.A. Duplex, Baramunda, Bhubaneswar, Khurda - 751003',
              },
              {
                zone: 'NORTH ZONE',
                city: 'Ambala, Haryana',
                address: 'Plot No. 446 (HNS), HSIIDC Industrial Growth Centre, Sector 2, Saha, Ambala - 133104',
              },
              {
                zone: 'SOUTH A ZONE',
                city: 'Hyderabad, Telangana',
                address: 'Third Floor, 303, Vedika Vintage, Madhapur, Chanda Naik Nagar, Survey of India Colony, Hyderabad',
              },
              {
                zone: 'SOUTH B ZONE',
                city: 'Malappuram, Kerala',
                address: 'Thirumangalam, Kavanur, Palakkad P.O., Kuzhimanna (Via), Malappuram - 673641',
              },
            ].map(({ zone, city, address }) => (
              <Box className="landing-footer-location" key={zone}>
                <span>{zone}</span>
                <Typography component="h3">{city}</Typography>
                <Typography>{address}</Typography>
              </Box>
            ))}
          </Box>
          <Box className="landing-footer-bottom">
            <Typography>© 2026 MiTRAA. All Rights Reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
