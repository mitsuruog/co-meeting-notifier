/* global describe, it, expect, beforeEach, afterEach, sinon */

(function () {
  'use strict';

  describe('Test: getUnleadCount()', function () {

    beforeEach(function() {});

    it('groupがnullの場合はnullを返す', function() {
      expect(comeeting.getUnleadCount(null)).to.equal(null);
    });

    it('groupがArrayの場合はnullを返す', function() {
      expect(comeeting.getUnleadCount('aaa')).to.equal(null);
    });

    it('未読OFFのグループは、未読件数に含めないこと', function() {
      var groups = [
        {unread_off: false, unread_counts: 1},
        {unread_off: true , unread_counts: 2}
      ];
      expect(comeeting.getUnleadCount(groups)).to.equal(1);
    });

    it('未読OFFグループが設定されていない場合、全ての未読件数をカウントアップすること', function() {
      var groups = [
        {unread_off: false, unread_counts: 1},
        {unread_off: false, unread_counts: 2}
      ];
      expect(comeeting.getUnleadCount(groups)).to.equal(3);
    });

  });

  describe('Test: isAccessTokenExpiresIn()', function () {

    var dummyDate;

    beforeEach(function() {

      // dummy localStorage
      var dummyToken = JSON.stringify({
        createAt: 0,
        expires_in: 86400
      });
      var stub = sinon.stub().withArgs('oauthToken').returns(dummyToken);
      localStorage.getItem = stub;

      // dummy timer
      dummyDate = sinon.useFakeTimers();

    });

    afterEach(function() {
      dummyDate.restore();
    });

    it('有効期限内', function() {
      dummyDate.tick(86400 * 1000);
      expect(comeeting.isAccessTokenExpiresIn()).to.equal(true);
    });

    it('有効期限外', function() {
      dummyDate.tick(86401 * 1000);
      expect(comeeting.isAccessTokenExpiresIn()).to.equal(false);
    });

  });

})();
