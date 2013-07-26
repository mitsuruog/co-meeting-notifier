/**
 * @fileoverview Main module include interval for fetch unread counts.
 * @copyright mitsuruog 2013
 * @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
 * @license MIT
 *
 * @module js/background.js
 */
var Background = function () {

	var module = {};
	var UPDATE_INTERVAL = 1000 * 60;

	function initialize () {

		module.assignEventHandlers();
		setInterval(module.fetch, UPDATE_INTERVAL);
		module.fetch();

	}

	module.assignEventHandlers = function () {

		chrome.browserAction.onClicked.addListener(function () {

			if (!comeetingNotifier.isAuthenticated()) {

				window.open(comeetingNotifier.getAuthorizationUrl());

			} else {
				chrome.browserAction.setPopup({
					popup: 'popup.html'
				});
			}
		});
	};

	module.render = function (badge, color, title) {

		chrome.browserAction.setBadgeText({
			text: badge
		});
		chrome.browserAction.setBadgeBackgroundColor({
			color: color
		});
		chrome.browserAction.setTitle({
			title: title
		});

	};

	module.fetch = function () {

		comeetingNotifier.fetchUnreadCount(function (unreadCount) {

			if (unreadCount) {
				//chrome.browserAction.setBadgeTextがString指定なのでキャストする
				module.render('' + unreadCount, [65, 131, 196, 255], 'co-meetiong Notifier');
			} else {
				module.render(':(', [166, 41, 41, 255], 'You have to be connected to the internet and logged into co-meetiong');
			}

		});
	};

	initialize();

	return module;

};
var bg = new Background();