describe('Tests comeeting.js', function() {

	beforeEach(function() {

		expect(comeetingNotifier).to.not.be(undefined);
	});

	it('認証用のURLが取得できること', function() {
		var authorizationUrl = 'https://www.co-meeting.com/oauth/authorize' +
				'?response_type=code&client_id=consumer_key&redirect_uri=chrome-extension://app_id/callback.html';
		expect(comeetingNotifier.getAuthorizationUrl()).to.be(authorizationUrl);
	});

});
