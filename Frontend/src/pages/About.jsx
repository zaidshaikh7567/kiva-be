import React from "react";
import aboutImg2 from "../assets/images/about-img2.jpg";
import { Star, Users, Award, Heart, CheckCircle, Shield, Gem, Clock, MapPin, Phone, Mail, Globe, Sparkles } from "lucide-react";
import AnimatedSection from "../components/home/AnimatedSection";
import { selectMedia } from '../store/slices/mediaSlice';
import { useSelector } from "react-redux";

const About = () => {
  const media = useSelector(selectMedia) || [];
  const features = [
    {
      icon: <Star className="w-8 h-8 text-white" />,
      title: "Quality Excellence",
      description:
        "We use only the finest materials including ethically sourced diamonds, 18k gold, and platinum. Every piece undergoes rigorous quality control to ensure it meets our exacting standards.",
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      title: "Master Craftsmanship",
      description:
        "Our artisans combine traditional techniques passed down through generations with cutting-edge technology, creating pieces that are both timeless and innovative.",
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Ethical Responsibility",
      description:
        "We are committed to responsible sourcing, fair trade practices, and environmental sustainability. Our diamonds are conflict-free and our metals are recycled whenever possible.",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Customer Centric",
      description:
        "Every customer is treated like family. We provide personalized service, lifetime warranties, and custom design services to ensure complete satisfaction.",
    },
    {
      icon: <Gem className="w-8 h-8 text-white" />,
      title: "Innovation",
      description:
        "We continuously explore new design concepts, materials, and techniques while respecting the traditional artistry that makes our jewelry special.",
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "Heritage & Tradition",
      description:
        "We honor the traditions of fine jewelry making while creating pieces that speak to contemporary sensibilities and will be treasured for generations to come.",
    },
  ];
  return (
    <div className="bg-white">
      {/* Hero Banner Section */}
      <AnimatedSection animationType="fadeInUp" delay={100}>
        <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={media.find(item => item.page === 'about' && item.section === 'about-page' && item.type === 'image')?.url}
            alt="About Kiva Jewellery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-5xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-sorts-mill-gloudy leading-tight mb-8">
              About Kiva<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl font-montserrat-regular-400 sm:mb-12 mb-6 max-w-3xl mx-auto leading-relaxed">
              Crafting timeless jewelry pieces that celebrate life's most precious moments since 1985
            </p>
            <div className="sm:flex block  items-center justify-center sm:space-x-4 text-lg font-montserrat-medium-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>40+ Years</span>
              </div>
              <div className="w-1 h-6 bg-primary sm:flex hidden"></div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>50+ Artisans</span>
              </div>
              <div className="w-1 h-6 bg-primary sm:flex hidden"></div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Company Overview Section */}
      <AnimatedSection animationType="fadeInLeft" delay={200}>
        <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-sorts-mill-gloudy text-black mb-8">
              Our Company
            </h2>
            <div className="w-40 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-xl font-montserrat-regular-400 text-black-light max-w-3xl mx-auto">
              Kiva Jewelry is a family-owned business that has been creating exquisite jewelry pieces for over four decades
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h3 className="text-3xl font-montserrat-bold-700 text-black mb-8">
                Our Story & Heritage
              </h3>
              <p className="text-lg font-montserrat-regular-400 text-black-light mb-6 leading-relaxed">
               Kiva Jewellery, established in 2024, celebrates the timeless beauty of Indian craftsmanship.
Inspired by the heritage of India and refined with a modern touch, each creation tells a story of grace and devotion.</p>
              <p className="text-lg font-montserrat-regular-400 text-black-light mb-8 leading-relaxed">
Our artisans bring life to every design through intricate detailing and premium materials.
From traditional elegance to contemporary sparkle, Kiva offers jewellery for every occasion.
We take pride in creating pieces that symbolize love, strength, and individuality.
Every jewel is designed to enhance your charm and connect you to your roots.
At Kiva, tradition meets modern luxury — beautifully and effortlessly.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-montserrat-semibold-600 text-black mb-3">Founded</h4>
                  <p className="text-lg font-montserrat-bold-700 text-primary">2024</p>
                </div>
                <div>
                  <h4 className="text-xl font-montserrat-semibold-600 text-black mb-3">Headquarters</h4>
                  <p className="text-lg font-montserrat-bold-700 text-primary">Gujarat, India</p>
                </div>
                  {/* <div>
                    <h4 className="text-xl font-montserrat-semibold-600 text-black mb-3">Employees</h4>
                    <p className="text-lg font-montserrat-bold-700 text-primary">75+</p>
                  </div> */}
                <div>
                  <h4 className="text-xl font-montserrat-semibold-600 text-black mb-3">Countries Served</h4>
                  <p className="text-lg font-montserrat-bold-700 text-primary">5+</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary-light rounded-3xl transform rotate-6"></div>
              <img
                src={media.find(item => item.page === 'about' && item.section === 'about-heritage' && item.type === 'image')?.url}
                alt="Our Heritage"
                className="relative z-10 rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Mission & Vision Section */}
      <AnimatedSection animationType="scaleIn" delay={300}>
        <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div className="bg-gradient-to-br from-primary-light to-primary rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-montserrat-bold-700 text-black mb-6">Our Mission</h3>
              <p className="text-lg font-montserrat-regular-400 text-black-light leading-relaxed">
                To create extraordinary jewelry that captures the essence of life's most meaningful moments, 
                while maintaining the highest standards of craftsmanship, quality, and ethical practices. 
                We believe every piece should tell a story and become a cherished heirloom.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-black to-black-light rounded-3xl p-12 text-center text-white">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-montserrat-bold-700 mb-6">Our Vision</h3>
              <p className="text-lg font-montserrat-regular-400 text-gray-300 leading-relaxed">
                To be the world's most trusted and innovative jewelry brand, known for our exceptional craftsmanship, 
                sustainable practices, and ability to create pieces that transcend generations. We envision a future 
                where luxury meets responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection animationType="fadeInRight" delay={400}>
        <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-sorts-mill-gloudy text-black mb-8">
              Our Core Values
            </h2>
            <p className="text-xl font-montserrat-regular-400 text-black-light max-w-3xl mx-auto">
              The principles that guide every decision we make and every piece we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {features.map((item, index) => (
        <div
          key={index}
          className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-primary"
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
            {item.icon}
          </div>
          <h3 className="text-2xl font-montserrat-semibold-600 text-black mb-4">
            {item.title}
          </h3>
          <p className="text-black-light font-montserrat-regular-400 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
};

export default About;
