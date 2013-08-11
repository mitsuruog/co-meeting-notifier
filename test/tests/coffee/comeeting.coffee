describe "Tests comeeting.js", ->

  beforeEach ->
    expect(comeetingNotifier).to.not.be(undefined)
    return

  it "認証用のURLが取得できること", ->
    authorizationUrl = '''
                       https://www.co-meeting.com/oauth/authorize?response_type=code&client_id=consumer_key&redirect_uri=chrome-extension://app_id/callback.html
                       '''
    expect(comeetingNotifier.getAuthorizationUrl()).to.be(authorizationUrl)
    return

  describe "Tests countUpUnread()", ->
    groups = [
      {unread_off: false, unread_counts: 1},
      {unread_off: true, unread_counts: 2},
    ]

    beforeEach ->

    it "普通に未読がカウントできること", ->
      expect(comeetingNotifier.countUpUnread(0, groups[0])).to.be(1)
      return
    it "未読OFFが有効の場合はカウントされないこと", ->
      expect(comeetingNotifier.countUpUnread(0, groups[1])).to.be(0)
      return
    return

  describe "Tests isExpiresIn()", ->
    beforeEach ->
      stub_oauthToken = sinon.stub().returns
        expires_in: 86400
        createAt: 0

      comeetingNotifier.oauthToken.get = stub_oauthToken
      @stub_date = new Date()
      return

    it "有効期間内", ->
      @stub_date.getTime = sinon.stub().returns(86400 * 1000)
      expect(comeetingNotifier.isExpiresIn(@stub_date)).to.be.ok()
      return
    it "有効期間切れ", ->
      @stub_date.getTime = sinon.stub().returns(86401 * 1000)
      expect(comeetingNotifier.isExpiresIn(@stub_date)).not.to.be.ok()
      return
    return

  describe "Test "
