!(function () {
	'use strict';

	var comeetingNotifier = new ComeetingNotifier();

	if (location.href.match(/code=(\S*)/)) {

		var code = location.href.match(/code=(\S*)/)[1];

		comeetingNotifier.claimAccessToken(code);

//開いているタブを閉じる
//	chrome.tabs.getSelected(null, function(tab) {
//		chrome.tabs.remove(tab.id);
//	});

	}

})();