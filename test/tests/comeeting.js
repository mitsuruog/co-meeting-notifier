describe('Tests comeeting.js', function() {

	beforeEach(function() {

		expect(comeetingNotifier).to.not.be(undefined);
	});

	it('認証用のURLが取得できること', function() {
		var authorizationUrl = 'https://www.co-meeting.com/oauth/authorize' +
				'?response_type=code&client_id=consumer_key&redirect_uri=chrome-extension://app_id/callback.html';
		expect(comeetingNotifier.getAuthorizationUrl()).to.be(authorizationUrl);
	});

	describe('Tests countUpUnread()', function(){

		var groups = [
			{unread_off: false, unread_counts:1},
			{unread_off: true , unread_counts:2}
		];

		beforeEach(function() {});

		it('普通に未読がカウントできること', function(){
			expect(comeetingNotifier.countUpUnread(0, groups[0])).to.be(1);
		});

		it('未読OFFが有効の場合はカウントされないこと', function(){
			expect(comeetingNotifier.countUpUnread(0, groups[1])).to.be(0);
		});

	});

	describe('Tests isExpiresIn()', function(){

		var stub_oauthToken, stub_date;

		beforeEach(function () {

			stub_oauthToken = sinon.stub().returns({
				expires_in: 86400,
				createAt: 0
			});
			comeetingNotifier.oauthToken.get = stub_oauthToken;

			stub_date = new Date();

		});

		it('有効期間内', function(){
 			stub_date.getTime = sinon.stub().returns(86400 * 1000);
			expect(comeetingNotifier.isExpiresIn(stub_date)).to.be.ok();
 		});

		it('有効期間切れ', function(){
 			stub_date.getTime = sinon.stub().returns(86401 * 1000);
			expect(comeetingNotifier.isExpiresIn(stub_date)).not.to.be.ok();
 		});

	});

});
