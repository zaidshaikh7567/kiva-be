const { messaging } = require('../config/firebase');
const User = require('../models/User');
const Notification = require('../models/Notification');
const logger = require('./logger');

/**
 * Send notification to a single device token
 * @param {string} token - FCM device token
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload (optional)
 * @returns {Promise<Object>} - Response from FCM
 */
const sendToDevice = async (token, notification, data = {}) => {
  if (!messaging) {
    logger.warn('Firebase messaging not initialized. Cannot send notification.');
    return { success: false, error: 'Firebase messaging not initialized' };
  }

  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.image && { image: notification.image }),
      },
      // data: {
      //   ...data,
      //   // Convert all data values to strings (FCM requirement)
      //   ...Object.keys(data).reduce((acc, key) => {
      //     acc[key] = String(data[key]);
      //     return acc;
      //   }, {}),
      // },
      data: Object.keys(data || {}).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
      
      token: token,
    };

    const response = await messaging.send(message);
    logger.info(`Successfully sent notification to device: ${response}`);
    return { success: true, messageId: response };
  } catch (error) {
    logger.error('Error sending notification to device:', error);
    
    // Handle invalid token
    if (error.code === 'messaging/invalid-registration-token' || 
        error.code === 'messaging/registration-token-not-registered') {
      // Remove invalid token from user's tokens array
      await removeInvalidToken(token);
      return { success: false, error: 'Invalid token', removed: true };
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to multiple device tokens
 * @param {string[]} tokens - Array of FCM device tokens
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload (optional)
 * @returns {Promise<Object>} - Response with success and failure counts
 */
const sendToMultipleDevices = async (tokens, notification, data = {}) => {
  if (!messaging) {
    logger.warn('Firebase messaging not initialized. Cannot send notification.');
    return { success: false, error: 'Firebase messaging not initialized' };
  }

  try {
    if (!tokens || tokens.length === 0) {
      return { success: false, error: 'No tokens provided' };
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.image && { image: notification.image }),
      },
      // data: {
      //   ...data,
      //   // Convert all data values to strings (FCM requirement)
      //   ...Object.keys(data).reduce((acc, key) => {
      //     acc[key] = String(data[key]);
      //     return acc;
      //   }, {}),
      // },
      data: Object.keys(data || {}).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
      
    };

    const chunkSize = 500;
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
    
      const response = await messaging.sendEachForMulticast({
        tokens: chunk,
        ...message,
      });
      console.log('response------------------------------> :', response);
    
      successCount += response.successCount;
      failureCount += response.failureCount;
    
      // Remove invalid tokens
      if (response.failureCount > 0) {
        const invalidTokens = [];
    
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const errorCode = resp.error?.code;
            if (
              errorCode === 'messaging/invalid-registration-token' ||
              errorCode === 'messaging/registration-token-not-registered'
            ) {
              invalidTokens.push(chunk[idx]);
            }
          }
        });
    
        if (invalidTokens.length > 0) {
          await removeInvalidTokens(invalidTokens);
        }
      }
    }
    
    return { success: true, successCount, failureCount };
    
    
    // Remove invalid tokens
    // if (response.failureCount > 0) {
    //   const invalidTokens = [];
    //   response.responses.forEach((resp, idx) => {
    //     if (!resp.success) {
    //       const errorCode = resp.error?.code;
    //       if (errorCode === 'messaging/invalid-registration-token' || 
    //           errorCode === 'messaging/registration-token-not-registered') {
    //         invalidTokens.push(tokens[idx]);
    //       }
    //     }
    //   });

    //   if (invalidTokens.length > 0) {
    //     await removeInvalidTokens(invalidTokens);
    //   }
    // }

    // logger.info(
    //   `Notification sent: ${response.successCount} successful, ${response.failureCount} failed`
    // );

    // return {
    //   success: true,
    //   successCount: response.successCount,
    //   failureCount: response.failureCount,
    // };
  } catch (error) {
    logger.error('Error sending notification to multiple devices:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to a user by user ID
 * @param {string} userId - User ID
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload (optional)
 * @returns {Promise<Object>} - Response from FCM
 */
const sendToUser = async (userId, notification, data = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.fcmTokens || user.fcmTokens.length === 0) {
      return { success: false, error: 'User has no FCM tokens' };
    }
    const latestToken = user.fcmTokens.slice(-1);
    console.log('latestToken---- :', latestToken);
    return await sendToMultipleDevices(latestToken, notification, data);
    
    // return await sendToMultipleDevices(user.fcmTokens, notification, data);
  } catch (error) {
    logger.error('Error sending notification to user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to all users
 * @param {Object} notification - Notification payload
 * @param {Object} data - Additional data payload (optional)
 * @param {Object} filters - Optional filters (e.g., { role: 'user' })
 * @returns {Promise<Object>} - Response with success and failure counts
 */
const sendToAllUsers = async (notification, data = {}, filters = {}) => {
  try {
    logger.info(`Sending notification to all users with filters: ${JSON.stringify(filters)}`);
    
    const users = await User.find({ 
      ...filters,
      fcmTokens: { $exists: true, $ne: [] }
    });

    logger.info(`Found ${users.length} users matching criteria`);

    if (users.length === 0) {
      logger.warn('No users with FCM tokens found matching filters:', filters);
      // Also check total admin users
      const allAdmins = await User.find({ role: 'super_admin' });
      logger.info(`Total admin users: ${allAdmins.length}`);
      allAdmins.forEach(admin => {
        logger.info(`Admin ${admin.email} has ${admin.fcmTokens?.length || 0} FCM tokens`);
      });
      return { success: false, error: 'No users with FCM tokens found' };
    }

    // Collect all tokens
    // const allTokens = users.flatMap(user => user.fcmTokens || []);
    const allTokens = [
      ...new Set(users.flatMap(user => user.fcmTokens || []))
    ];
    
    logger.info(`Collected ${allTokens.length} FCM tokens to send notifications to`);

    if (allTokens.length === 0) {
      logger.warn('No FCM tokens found in user records');
      return { success: false, error: 'No FCM tokens found' };
    }

    // Send FCM notifications
    const latestTokens = allTokens.slice(-1);
    const result = await sendToMultipleDevices(latestTokens, notification, data);
    logger.info(`Notification send result: ${JSON.stringify(result)}`);

    // Save notifications to database for all users
    try {
      const notificationDocs = users.map(user => ({
        user: user._id,
        title: notification.title,
        body: notification.body,
        image: notification.image || null,
        type: data.type || 'general',
        data: data,
        read: false,
      }));

      await Notification.insertMany(notificationDocs);
      logger.info(`Saved ${notificationDocs.length} notifications to database`);
    } catch (dbError) {
      logger.error('Error saving notifications to database:', dbError);
      // Don't fail the whole operation if DB save fails
    }

    return result;
  } catch (error) {
    logger.error('Error sending notification to all users:', error);
    return { success: false, error: error.message };
  }
};




/**
 * Remove invalid token from all users
 * @param {string} token - Invalid FCM token
 */
const removeInvalidToken = async (token) => {
  try {
    await User.updateMany(
      { fcmTokens: token },
      { $pull: { fcmTokens: token } }
    );
    logger.info(`Removed invalid token from users`);
  } catch (error) {
    logger.error('Error removing invalid token:', error);
  }
};

/**
 * Remove multiple invalid tokens from all users
 * @param {string[]} tokens - Array of invalid FCM tokens
 */
const removeInvalidTokens = async (tokens) => {
  try {
    await User.updateMany(
      { fcmTokens: { $in: tokens } },
      { $pullAll: { fcmTokens: tokens } }
    );
    logger.info(`Removed ${tokens.length} invalid tokens from users`);
  } catch (error) {
    logger.error('Error removing invalid tokens:', error);
  }
};

module.exports = {
  sendToDevice,
  sendToMultipleDevices,
  sendToUser,
  sendToAllUsers,
  removeInvalidToken,
  removeInvalidTokens,
};

