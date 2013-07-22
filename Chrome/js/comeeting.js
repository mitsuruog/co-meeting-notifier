/**
 * @fileoverview Core module that authorization and call to co-meeting API.
 * @copyright mitsuruog 2013
 * @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
 * @license MIT
 *
 * @return {{}}
 * @constructor
 *
 * @module js/comeeting.js
 */
var ComeetingNotifier = function () {
	'use strict';

	var authURL = {
		redirect: 'chrome-extension://' + APPLICATION_ID + '/callback.html',
		authorize: 'https://www.co-meeting.com/oauth/authorize',
		token: 'https://www.co-meeting.com/oauth/token'
	};

	var NOTIFICATIONS_URL = 'https://www.co-meeting.com/api/v1/groups/my';

	$.ajaxSetup({
		beforeSend: function (xhr) {
			if (module.isAuthenticated()) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + module.getToken());
			}
		},
		cache: false
	});

	var module = {};

	/**
	 *
	 */
	module.claimAuthorization = function () {

		module._resetAuthorization();

		var authorizeUrl = authURL.authorize;
		authorizeUrl += '?response_type=code';
		authorizeUrl += '&client_id=' + OAUTH_CONSUMER_KEY;
		authorizeUrl += '&redirect_uri=' + authURL.redirect;

		window.open(authorizeUrl);

	};

	/**
	 *
	 * @private
	 */
	module._resetAuthorization = function () {

		localStorage.setItem("oauth_token", '');
		localStorage.setItem("refresh_token", '');
		localStorage.setItem("expires_in", '');
		localStorage.setItem("groupList", '');

		chrome.browserAction.setPopup({popup: ''});

	};

	/**
	 *
	 * @param code
	 */
	module.claimAccessToken = function (code) {

		var settings = {
			url: authURL.token,
			type: 'POST'
		};

		settings.data = {
			grant_type: 'authorization_code',
			code: code,
			client_id: OAUTH_CONSUMER_KEY,
			client_secret: OAUTH_CONSUMER_SECRET,
			redirect_uri: authURL.redirect
		};

		$.ajax(settings)
			.done(function (accessToken) {

				if (!accessToken) {
					console.debug('accessToken is empty');
					return;
				}
				module._setOauthToken(accessToken);

			}).fail(function (jqXHR, state, statusText) {

				console.log(state + ':' + jqXHR.status + ' ' + statusText);
				module._resetAuthorization();

			});

	};

	/**
	 *
	 */
	module.claimRefreshToken = function () {

		var token = this.retRefreshToken();
		if (!token) return;

		var settings = {
			url: authURL.token,
			type: 'POST'
		};

		settings.data = {
			grant_type: 'refresh_token',
			refresh_token: token,
			client_id: OAUTH_CONSUMER_KEY,
			client_secret: OAUTH_CONSUMER_SECRET
		};

		$.ajax(settings)
			.done(function (accessToken) {

				if (!accessToken) {
					console.debug('accessToken is empty');
					return;
				}
				module._setOauthToken(accessToken);

			}).fail(function (jqXHR, state, statusText) {

				console.log(state + ':' + jqXHR.status + ' ' + statusText);
				module._resetAuthorization();

			});

	};

	/**
	 * return group list
	 * @returns {*}
	 */
	module.getGroupList = function () {
		var groupList = localStorage.getItem("groupList");
		if (!groupList) {
			console.debug('groupList is empty');
		}
		if (!_.isArray(groupList)) {
			console.debug('groupList is not Array');
		}
		return groupList ? JSON.parse(groupList) : void 0;
	};

	/**
	 * set group list
	 * @param groupList
	 */
	module.setGroupList = function (groupList) {
		if (!groupList) {
			console.debug('groupList is empty');
		}
		localStorage.setItem("groupList", JSON.stringify(groupList));
	};

	/**
	 *
	 * @returns {*}
	 * @private
	 */
	module._getOauthToken = function () {
		var oauthToken = localStorage.getItem("oauth_token");
		if (!oauthToken) {
			console.debug('oauthToken is empty');
		}
		return oauthToken ? JSON.parse(oauthToken) : void 0;
	};

	/**
	 *
	 * @param oauthToken
	 * @private
	 */
	module._setOauthToken = function (oauthToken) {
		localStorage.setItem("oauth_token", JSON.stringify(oauthToken));
	};

	/**
	 *
	 * @returns {*}
	 */
	module.getToken = function () {
		var oauthToken = module._getOauthToken();
		if (!oauthToken || !oauthToken.access_token) {
			console.debug('access_token is not String');
		}
		return oauthToken.access_token;
	};

	/**
	 *
	 * @returns {*}
	 */
	module.getRefreshToken = function () {
		var oauthToken = module._getOauthToken();
		if (!oauthToken || !oauthToken.refresh_token) {
			console.debug('refresh_token is not String');
		}
		return oauthToken.refresh_token;
	};

	/**
	 *
	 * @returns {boolean}
	 */
	module.isAuthenticated = function () {
		return !!module._getOauthToken();
	};

	/**
	 *
	 * @param callback
	 */
	module.comeetingNotifCount = function (callback) {

		if (!module.isAuthenticated()) {
			callback();
			return;
		}

		var settings = {
			url: NOTIFICATIONS_URL,
			type: 'GET'
		};

		$.ajax(settings)
			.done(function (data) {

				if (!data || !data.result || !_.isArray(data.result.groups)) {
					console.debug('groupList is not Array');
					console.debug(data);
					return;
				}

				var groupList = data.result.groups;
				var unreadCount = 0;

				localStorage.setItem("groupList", JSON.stringify(groupList));

				_.each(groupList, function (group) {
					unreadCount += group.unread_counts;
				});

				callback(unreadCount);

			}).fail(function (jqXHR, state, statusText) {

				if (jqXHR.status === 401) {
					//refresh token
					//callbackにcomeetingNotifCount()を渡してもいいが、無限ループしそうなのでやめる
					module.claimRefreshToken();
				}

				console.log(state + ':' + jqXHR.status + ' ' + statusText);
				module._resetAuthorization();

				callback();

			});

	};

	return module;

};