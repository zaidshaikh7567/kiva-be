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
    console.error('❌ Firebase messaging not initialized');
    logger.warn('Firebase messaging not initialized. Cannot send notification.');
    return { success: false, error: 'Firebase messaging not initialized' };
  }

  try {
    if (!tokens || tokens.length === 0) {
      console.error('❌ No tokens provided to sendToMultipleDevices');
      return { success: false, error: 'No tokens provided' };
    }

    console.log('📤 sendToMultipleDevices called');
    console.log('   Token count:', tokens.length);
    console.log('   Notification title:', notification.title);
    console.log('   Notification body:', notification.body);

    // Generate unique messageId for deduplication
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.image && { image: notification.image }),
      },
      data: {
        ...Object.keys(data || {}).reduce((acc, key) => {
          acc[key] = String(data[key]);
          return acc;
        }, {}),
        messageId: messageId, // Add messageId for client-side deduplication
      },
    };

    console.log('   Message payload prepared, sending to FCM...');

    const chunkSize = 500;
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
      console.log(`   Sending chunk ${i / chunkSize + 1} (${chunk.length} tokens)...`);
    
      const response = await messaging.sendEachForMulticast({
        tokens: chunk,
        ...message,
      });
      
      console.log('   FCM Response:', {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses.map(r => ({
          success: r.success,
          error: r.error?.code || r.error?.message || null
        }))
      });
    
      successCount += response.successCount;
      failureCount += response.failureCount;
    
      // Remove invalid tokens
      if (response.failureCount > 0) {
        const invalidTokens = [];
    
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const errorCode = resp.error?.code;
            console.error(`   ❌ Token ${idx} failed:`, errorCode, resp.error?.message);
            if (
              errorCode === 'messaging/invalid-registration-token' ||
              errorCode === 'messaging/registration-token-not-registered'
            ) {
              invalidTokens.push(chunk[idx]);
            }
          }
        });
    
        if (invalidTokens.length > 0) {
          console.log(`   🗑️ Removing ${invalidTokens.length} invalid tokens...`);
          await removeInvalidTokens(invalidTokens);
        }
      }
    }
    
    console.log(`✅ sendToMultipleDevices completed: ${successCount} success, ${failureCount} failed`);
    return { success: true, successCount, failureCount, messageId };
    
    
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
    
    // Check Firebase messaging status first
    if (!messaging) {
      console.error('   ❌ Firebase messaging is NULL - check Firebase initialization');
    }
    
    // Fetch user with fcmTokens field explicitly
    const user = await User.findById(userId);
    console.log('   User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.error('❌ User not found:', userId);
      return { success: false, error: 'User not found' };
    }

    console.log('   User email:', user.email);
    console.log('   User fcmTokens:', user.fcmTokens);
    console.log('   Token count:', user.fcmTokens?.length || 0);
    console.log('   Tokens array:', JSON.stringify(user.fcmTokens));

    // Save notification to database first (even if user has no tokens or is not logged in)
    // This ensures notifications are stored for later viewing
    try {
      const notificationDoc = new Notification({
        user: userId,
        title: notification.title,
        body: notification.body,
        image: notification.image || null,
        type: data.type || 'general',
        data: data,
        read: false,
      });

      await notificationDoc.save();
      console.log('✅ Notification saved to database');
      logger.info(`Saved notification to database for user ${userId}`);
    } catch (dbError) {
      console.error('❌ Error saving notification to database:', dbError);
      logger.error('Error saving notification to database:', dbError);
      // Continue with FCM send even if DB save fails
    }

    // Check if Firebase messaging is initialized
    if (!messaging) {
      console.error('❌ Firebase messaging not initialized - cannot send FCM notification');
      logger.error('Firebase messaging not initialized - cannot send FCM notification');
      return {
        success: false,
        error: 'Firebase messaging not initialized',
        saved: true,
        message: 'Notification saved to database but FCM not available'
      };
    }

    // Send FCM notification if user has tokens
    if (!user.fcmTokens || user.fcmTokens.length === 0) {
      console.warn('⚠️ User has no FCM tokens');
      console.warn('   This means the user has not visited the frontend and allowed notifications yet');
      logger.warn(`User ${userId} has no FCM tokens, notification saved to database only`);
      return { 
        success: true, 
        message: 'Notification saved to database (no FCM tokens available)',
        saved: true,
        reason: 'User has not initialized FCM or granted notification permission'
      };
    }

    // Get the latest token (same pattern as sendToAllUsers)
    const latestTokens = user.fcmTokens.slice(-1);
    console.log('📱 Preparing to send FCM notification...');
    console.log('   Token count:', latestTokens.length);
    console.log('   Token (first 30 chars):', latestTokens[0]?.substring(0, 30) + '...');
    console.log('   Full token:', latestTokens[0]);
    
    // Use sendToMultipleDevices (same as sendToAllUsers)
    let fcmResult;
    try {
      fcmResult = await sendToMultipleDevices(latestTokens, notification, data);
      console.log('📊 FCM send result:', JSON.stringify(fcmResult, null, 2));
    } catch (fcmError) {
      console.error('❌ Exception in sendToMultipleDevices:', fcmError);
      console.error('   Error message:', fcmError.message);
      console.error('   Error stack:', fcmError.stack);
      logger.error('Exception sending FCM notification:', fcmError);
      return {
        success: false,
        error: fcmError.message,
        saved: true,
        message: 'Notification saved to database but FCM send failed'
      };
    }
    
    // Check if actually successful (sendToMultipleDevices returns success: true even if successCount is 0)
    if (!fcmResult.success) {
      console.error('❌ FCM send returned success: false');
      console.error('   Error:', fcmResult.error);
      logger.error(`FCM notification failed for user ${userId}:`, fcmResult.error);
      return {
        ...fcmResult,
        saved: true,
        message: 'Notification saved to database but FCM send failed'
      };
    }
    
    if (fcmResult.successCount === 0 && fcmResult.failureCount > 0) {
      console.error('❌ FCM send failed - all tokens failed');
      console.error('   Success count:', fcmResult.successCount);
      console.error('   Failure count:', fcmResult.failureCount);
      logger.error(`FCM notification failed for user ${userId} - all tokens failed`);
      return {
        ...fcmResult,
        saved: true,
        message: 'Notification saved to database but all FCM tokens failed'
      };
    } else if (fcmResult.successCount > 0) {
      console.log('✅ FCM notification sent successfully!');
      console.log('   Success count:', fcmResult.successCount);
      console.log('   Failure count:', fcmResult.failureCount);
      logger.info(`FCM notification sent successfully to user ${userId}`);
    } else {
      console.warn('⚠️ FCM send completed but successCount is 0 and failureCount is 0');
      console.warn('   This is unusual - check FCM response');
    }
    
    // Return result with saved flag
    return {
      ...fcmResult,
      saved: true
    };
  } catch (error) {
    console.error('❌ Error in sendToUser:', error);
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
    
    // Find ALL users matching filters (not just those with tokens)
    // This ensures notifications are saved even if users don't have FCM tokens or aren't logged in
    const allUsers = await User.find(filters);
    logger.info(`Found ${allUsers.length} users matching criteria`);

    if (allUsers.length === 0) {
      logger.warn('No users found matching filters:', filters);
      return { success: false, error: 'No users found matching criteria' };
    }

    // Save notifications to database for ALL users FIRST (even if they don't have tokens)
    // This ensures notifications are stored for later viewing when admin logs in
    try {
      const notificationDocs = allUsers.map(user => ({
        user: user._id,
        title: notification.title,
        body: notification.body,
        image: notification.image || null,
        type: data.type || 'general',
        data: data,
        read: false,
      }));

      await Notification.insertMany(notificationDocs);
      logger.info(`Saved ${notificationDocs.length} notifications to database for all matching users`);
    } catch (dbError) {
      logger.error('Error saving notifications to database:', dbError);
      // Continue with FCM send even if DB save fails
    }

    // Filter users who have FCM tokens for sending push notifications
    const usersWithTokens = allUsers.filter(user => 
      user.fcmTokens && user.fcmTokens.length > 0
    );

    if (usersWithTokens.length === 0) {
      logger.warn('No users with FCM tokens found, but notifications saved to database');
      return { 
        success: true, 
        message: 'Notifications saved to database (no FCM tokens available)',
        saved: true,
        savedCount: allUsers.length
      };
    }

    // Collect all tokens from users who have them
    const allTokens = [
      ...new Set(usersWithTokens.flatMap(user => user.fcmTokens || []))
    ];
    
    logger.info(`Collected ${allTokens.length} FCM tokens to send notifications to`);

    if (allTokens.length === 0) {
      logger.warn('No FCM tokens found in user records');
      return { 
        success: true, 
        message: 'Notifications saved to database (no FCM tokens available)',
        saved: true,
        savedCount: allUsers.length
      };
    }

    // Send FCM notifications
    const latestTokens = allTokens.slice(-1);
    const result = await sendToMultipleDevices(latestTokens, notification, data);
    logger.info(`Notification send result: ${JSON.stringify(result)}`);

    // Return result with saved count
    return {
      ...result,
      saved: true,
      savedCount: allUsers.length,
      sentCount: usersWithTokens.length
    };
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

