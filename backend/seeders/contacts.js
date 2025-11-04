const Contact = require('../models/Contact');
const logger = require('../utils/logger');

const contactsData = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0101',
    message: 'I am interested in purchasing a custom engagement ring. Could you please provide more information about your customization options?',
    service: 'general'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0102',
    message: 'I would like to know about your return policy and warranty information for diamond jewelry.',
    service: 'general'
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    message: 'Do you offer jewelry repair services? I have a vintage ring that needs restoration.',
    service: 'general'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1-555-0104',
    message: 'I am looking for a specific type of gemstone. Can you help me find what I am looking for?',
    service: 'general'
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '+1-555-0105',
    message: 'I would like to schedule an appointment to view your jewelry collection in person.',
    service: 'general'
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    message: 'What is your shipping policy for international orders? I am located outside the US.',
    service: 'general'
  },
  {
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    phone: '+1-555-0107',
    message: 'I am interested in your wholesale program for jewelers. Please contact me with more details.',
    service: 'general'
  },
  {
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@example.com',
    message: 'Can you provide information about your diamond certification process and grading standards?',
    service: 'general'
  }
];

const seedContacts = async () => {
  try {
    const contacts = await Contact.insertMany(contactsData);
    return contacts;
  } catch (error) {
    logger.error('Error seeding contacts:', error);
    throw error;
  }
};

module.exports = seedContacts;

