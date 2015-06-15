(function() {
  'use strict';

  var Comeeting = function() {

  };

  Comeeting.prototype.getAccessToken = function(code) {
    var that = this;
    return Promise.resolve($.ajax({
      url: window.comeetingConfig.URL.TOKEN,
      type: 'POST',
      data: {
        grant_type: 'authorization_code',
        code: code,
        client_id: window.comeetingConfig.OAUTH_CONSUMER_KEY,
        client_secret: window.comeetingConfig.OAUTH_CONSUMER_SECRET,
        redirect_uri: window.comeetingConfig.URL.REDIRECT
      }
    })).then(function(token) {
      //console.log('token:', token);
      that.setToken(token);
      return Promise.resolve(token.access_token);
    });
  };

  Comeeting.prototype.getRefreshToken = function() {
    var that = this;
    var refreshToken = that.getRefleshToken();
    return Promise.resolve($.ajax({
      url: window.comeetingConfig.URL.TOKEN,
      type: 'POST',
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: window.comeetingConfig.OAUTH_CONSUMER_KEY,
        client_secret: window.comeetingConfig.OAUTH_CONSUMER_SECRET,
        redirect_uri: window.comeetingConfig.URL.REDIRECT
      }
    })).then(function(token) {
      //console.log('token:', token);
      that.setToken(token);
      return Promise.resolve(token.access_token);
    });
  };

  Comeeting.prototype.getUserInfo = function() {
    var token = this.getToken();
    return Promise.resolve($.ajax({
      url: window.comeetingConfig.URL.ME,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })).then(function(user) {
      //console.log('user:', user);
      localStorage.setItem('accounts', JSON.stringify(user.result));
      return Promise.resolve(user.result);
    });
  };

  Comeeting.prototype.getGroupInfo = function() {
    var that = this;

    // 未認証の場合
    if(!that.getToken()) {
      return Promise.resolve(null);
    }

    // トークンの有効期限チェック
    return Promise.resolve(this.isAccessTokenExpiresIn()).then(function(isVaild) {
      if(isVaild) {
        return that.getToken();
      } else {
        // リフレッシュトークン
        return that.getRefreshToken();
      }
    }).then(function(token) {
      // グループ情報取得
      return Promise.resolve($.ajax({
        url: window.comeetingConfig.URL.FETCH,
        type: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }));
    }).then(function(groupInfo) {
      //console.log('groupInfo:', groupInfo);
      localStorage.setItem('groupList', JSON.stringify(groupInfo.result.groups));
      return Promise.resolve(groupInfo.result.groups);
    });

  };

  Comeeting.prototype.getUnleadCount = function(groups) {
    var unReadCount = 0;
    if(!Array.isArray(groups)) {
      return null;
    }
    groups.forEach(function(group) {
      if(!group.unread_off && group.unread_counts) {
        unReadCount += group.unread_counts;
      }
    });
    return unReadCount;
  };

  Comeeting.prototype.isAccessTokenExpiresIn = function() {
    var now = new Date();
    var tokenObj = JSON.parse(localStorage.getItem('oauthToken'));
    var createAt = parseInt(tokenObj.createAt, 10);
    var expiresIn = parseInt(tokenObj.expires_in, 10) * 1000;
    return (createAt + expiresIn) >= now.getTime();
  };

  Comeeting.prototype.getToken = function() {
    if(localStorage.getItem('oauthToken')) {
      return JSON.parse(localStorage.getItem('oauthToken')).access_token;
    } else {
      return null;
    }
  };

  Comeeting.prototype.setToken = function(tokenObj) {
    tokenObj = tokenObj || {};
    tokenObj.createAt = new Date().getTime();
    localStorage.setItem('oauthToken', JSON.stringify(tokenObj));
  };

  Comeeting.prototype.getRefleshToken = function() {
    if(localStorage.getItem('oauthToken')) {
      return JSON.parse(localStorage.getItem('oauthToken')).refresh_token;
    } else {
      return null;
    }
  };

  Comeeting.prototype.getAccount = function() {
    if(localStorage.getItem('accounts')) {
      return JSON.parse(localStorage.getItem('accounts'));
    } else {
      return null;
    }
  };

  Comeeting.prototype.clearAll = function() {
    localStorage.clear();
  };

  window.comeeting = new Comeeting();

})();
