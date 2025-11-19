import React from 'react'
import HeroSection from '../components/home/HeroSection'
import SubHeroSection from '../components/home/SubHeroSection'
import TrendingSection from '../components/home/TrendingSection'
import Collection from '../components/home/Collection'
import FavoriteSection from '../components/home/FavoriteSection'
import DiamondSection from '../components/home/DiamondSection'
import ReviewsSlider from '../components/ReviewsSlider'
import AnimatedSection from '../components/home/AnimatedSection'

const Home = () => {
  return (
    <div className='bg-secondary'>
        <HeroSection/>
        
        <AnimatedSection animationType="fadeInUp" delay={100}>
          <SubHeroSection/>
        </AnimatedSection>
        
        <AnimatedSection animationType="fadeInLeft" delay={200}>
          <TrendingSection/>
        </AnimatedSection>
        
        <AnimatedSection animationType="scaleIn" delay={300}>
          <Collection/>
        </AnimatedSection>
        
        <AnimatedSection animationType="fadeInUp" delay={400}>
          <DiamondSection/>
        </AnimatedSection>
        
        <AnimatedSection animationType="fadeInRight" delay={500}>
          <FavoriteSection/>
        </AnimatedSection>
        
        <AnimatedSection animationType="fadeInUp" delay={600}>
          <ReviewsSlider/>
        </AnimatedSection>
    </div>
  )
}

export default Home