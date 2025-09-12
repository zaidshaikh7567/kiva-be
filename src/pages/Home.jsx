import React from 'react'
import HeroSection from '../components/home/HeroSection'
import SubHeroSection from '../components/home/SubHeroSection'
import TrendingSection from '../components/home/TrendingSection'
import Collection from '../components/home/Collection'

const Home = () => {
  return (
    <div className='bg-secondary'>
        <HeroSection/>
        <SubHeroSection/>
        <TrendingSection/>
        <Collection/>
    </div>
  )
}

export default Home