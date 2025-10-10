import React from 'react';
import { Shield, Lock, Eye, UserCheck, Mail, AlertCircle } from 'lucide-react';
import Container from '../components/Container';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you create an account or place an order, we collect information such as your name, email address, phone number, shipping address, and billing information. This information is necessary to process your orders and provide customer service.'
        },
        {
          subtitle: 'Payment Information',
          text: 'We collect payment card details through secure, encrypted payment processors. We do not store complete credit card information on our servers. All payment data is handled in compliance with PCI-DSS standards.'
        },
        {
          subtitle: 'Browsing Information',
          text: 'We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, pages visited, and time spent on pages. This helps us improve our website and services.'
        },
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Order Processing',
          text: 'We use your information to process orders, arrange shipping, send order confirmations, and provide customer support. This includes communicating about your orders via email or phone.'
        },
        {
          subtitle: 'Marketing Communications',
          text: 'With your consent, we may send you promotional emails about new products, special offers, and exclusive deals. You can unsubscribe from marketing emails at any time using the link in the email.'
        },
        {
          subtitle: 'Website Improvement',
          text: 'We analyze browsing data to understand how customers use our website, which helps us improve user experience, add new features, and optimize our product offerings.'
        },
        {
          subtitle: 'Fraud Prevention',
          text: 'We may use your information to detect and prevent fraudulent transactions and protect against unauthorized access to accounts or personal information.'
        },
      ]
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We share information with trusted third-party service providers who help us operate our business, including payment processors, shipping companies, and email service providers. These partners are contractually obligated to keep your information secure.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, court order, or governmental request, or to protect our rights, property, or safety, or that of our customers or the public.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner, subject to the same privacy protections outlined in this policy.'
        },
        {
          subtitle: 'No Selling of Data',
          text: 'We do not sell, rent, or trade your personal information to third parties for their marketing purposes.'
        },
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access and Update',
          text: 'You can access and update your personal information anytime by logging into your account or contacting our customer service team.'
        },
        {
          subtitle: 'Data Deletion',
          text: 'You have the right to request deletion of your personal data. Contact us to initiate this process. Note that we may need to retain certain information for legal or operational purposes.'
        },
        {
          subtitle: 'Marketing Preferences',
          text: 'You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or updating your account preferences.'
        },
        {
          subtitle: 'Cookie Preferences',
          text: 'You can control cookie preferences through your browser settings. Note that disabling certain cookies may limit website functionality.'
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <Container>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-sorts-mill-gloudy font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl font-montserrat-regular-400 text-white/90 max-w-2xl mx-auto">
              Your privacy and data security are our top priorities
            </p>
            <p className="text-sm font-montserrat-regular-400 text-white/80 mt-4">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Introduction */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-montserrat-regular-400 text-blue-900 leading-relaxed">
                  At Aurora Jewelry, we respect your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, share, and protect your data when you visit our website 
                  or make a purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => {
              const Icon = section.icon;
              return (
                <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-montserrat-semibold-600 text-black mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-black-light font-montserrat-regular-400 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cookies Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-6">
              Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-black-light font-montserrat-regular-400 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                and understand where our visitors come from. Cookies are small text files stored on your device.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-montserrat-semibold-600 text-black mb-2">Types of Cookies We Use:</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Essential Cookies:</strong> Required for website functionality</li>
                    <li>• <strong>Analytics Cookies:</strong> Help us understand site usage</li>
                    <li>• <strong>Marketing Cookies:</strong> Enable personalized advertising</li>
                    <li>• <strong>Preference Cookies:</strong> Remember your settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-montserrat-semibold-600 text-black mb-2">Managing Cookies:</h3>
                  <ul className="space-y-2">
                    <li>• Control cookies through browser settings</li>
                    <li>• Delete cookies at any time</li>
                    <li>• Opt out of tracking cookies</li>
                    <li>• Note: Disabling cookies may limit functionality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black">
                Data Security
              </h2>
            </div>
            <p className="text-black-light font-montserrat-regular-400 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-black-light font-montserrat-regular-400">
              <li>• SSL/TLS encryption for all data transmission</li>
              <li>• Secure payment processing through certified providers</li>
              <li>• Regular security audits and updates</li>
              <li>• Restricted access to personal data</li>
              <li>• Secure data storage with encryption at rest</li>
            </ul>
          </div>

          {/* Children's Privacy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
              Children's Privacy
            </h2>
            <p className="text-black-light font-montserrat-regular-400 leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately so we can delete it.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold text-black mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-black-light font-montserrat-regular-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new policy on this page and updating the "Last Updated" date. We encourage you to review this policy 
              periodically for any changes.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center mt-12">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-sorts-mill-gloudy font-bold mb-3">
              Questions About Privacy?
            </h2>
            <p className="font-montserrat-regular-400 text-white/90 mb-6 max-w-2xl mx-auto">
              If you have any questions or concerns about our Privacy Policy or how we handle your data, 
              please don't hesitate to contact us.
            </p>
            <div className="space-y-2">
              <p className="font-montserrat-medium-500">Email: privacy@aurorajewelry.com</p>
              <p className="font-montserrat-medium-500">Phone: +1 (555) 123-4567</p>
            </div>
            <a
              href="/contact"
              className="inline-block mt-6 bg-white text-primary px-8 py-3 rounded-lg font-montserrat-semibold-600 hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;

