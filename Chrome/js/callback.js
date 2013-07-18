!(function () {
	'use strict';

	var comeetingNotifer = new ComeetingNotifer();

	if (location.href.match(/code=(\S*)/)) {

		var code = location.href.match(/code=(\S*)/)[1];

		comeetingNotifer.claimAccessToken(code);

//開いているタブを閉じる
//	chrome.tabs.getSelected(null, function(tab) {
//		chrome.tabs.remove(tab.id);
//	});

	}

})();