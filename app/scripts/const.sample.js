(function() {
  'use strict';
  window.comeetingConfig = {
    OAUTH_CONSUMER_KEY: '<OAUTH_CONSUMER_KEY>',
    OAUTH_CONSUMER_SECRET: '<OAUTH_CONSUMER_SECRET>',
    APPLICATION_ID: '<APPLICATION_ID>'
  };
  window.comeetingConfig.URL = {
    REDIRECT: 'chrome-extension://' + window.comeetingConfig.APPLICATION_ID + '/callback.html',
    AUTHORIZE: 'https://www.co-meeting.com/oauth/authorize',
    TOKEN: 'https://www.co-meeting.com/oauth/token',
    FETCH: 'https://www.co-meeting.com/api/v1/groups/my',
    ME: 'https://www.co-meeting.com/api/v1/users/me'
  };
  window.comeetingConfig.BACK_GROUND = {
    COLOR_BLUE: [65, 131, 196, 255],
    COLOR_RED: [166, 41, 41, 255],
    UPDATE_INTERVAL: 1
  };
})();
