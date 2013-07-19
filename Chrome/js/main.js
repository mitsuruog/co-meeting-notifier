!(function () {
	'use strict';

	var UPDATE_INTERVAL = 1000 * 60;
	var comeetingNotifer = new ComeetingNotifier();

	chrome.browserAction.onClicked.addListener(function () {

		if (!comeetingNotifer.isAuthenticated()) {
			comeetingNotifer.claimAuthorization();
			return;
		}

		chrome.browserAction.setPopup({
			popup: 'popup.html'
		});

	});

	function render(badge, color, title) {

		chrome.browserAction.setBadgeText({
			text: badge
		});
		chrome.browserAction.setBadgeBackgroundColor({
			color: color
		});
		chrome.browserAction.setTitle({
			title: title
		});

	}

	function update() {

		comeetingNotifer.comeetingNotifCount(function (count) {

			if (count) {
				//chrome.browserAction.setBadgeTextがString指定なのでキャストする
				render('' + count, [65, 131, 196, 255], 'co-meetiong Notifier');
			} else {
				render(':(', [166, 41, 41, 255], 'You have to be connected to the internet and logged into co-meetiong');
			}

		});

	}

	setInterval(update, UPDATE_INTERVAL);

	//初回アクセス用
	update();

})();
