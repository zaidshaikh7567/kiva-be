const User = require('../models/User');
const logger = require('../utils/logger');

const seedUsers = async () => {
  try {
    const usersData = [
      {
        name: 'Super Admin',
        email: 'admin@mailinator.com',
        password: 'Admin@123',
        role: 'super_admin',
        active: true
      },
      {
        name: 'John Doe',
        email: 'john.doe@mailinator.com',
        password: 'User@123',
        role: 'user',
        active: true
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@mailinator.com',
        password: 'User@123',
        role: 'user',
        active: true
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@mailinator.com',
        password: 'User@123',
        role: 'user',
        active: true
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@mailinator.com',
        password: 'User@123',
        role: 'user',
        active: false
      }
    ];

    const users = [];
    for (const userData of usersData) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }

    return users;
  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
};

module.exports = seedUsers;
