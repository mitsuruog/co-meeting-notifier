# @fileoverview Core module that authorization and call to co-meeting API.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @return {{}}
# @constructor
#
# @module js/comeeting.coffee

URL =
  REDIRECT: "chrome-extension://" + APPLICATION_ID + "/callback.html"
  AUTHORIZE: "https://www.co-meeting.com/oauth/authorize"
  TOKEN: "https://www.co-meeting.com/oauth/token"
  FETCH: 'https://www.co-meeting.com/api/v1/groups/my'
  ME: 'https://www.co-meeting.com/api/v1/users/me'

class ComeetingNotifier

  constructor: ->
    @ajaxSettings()

  ajaxSettings: =>
    $.ajaxSetup
      beforeSend: (xhr) =>
        if @isAuthenticated()
          xhr.setRequestHeader "Authorization", "Bearer " + @accessToken().get()
          return
      cache: false
      error: (jqXHR, state, statusText) ->
        throw new Error "#{state}:#{jqXHR.status} #{statusText}"
    return

  getAuthorizationUrl: ->
    URL.AUTHORIZE + "?response_type=code&client_id=" + OAUTH_CONSUMER_KEY + "&redirect_uri=" + URL.REDIRECT

  claimAccessToken: (code, callback) =>

    result = $.ajax
      url: URL.TOKEN
      type: "POST"
      data:
        grant_type: "authorization_code"
        code: code
        client_id: OAUTH_CONSUMER_KEY
        client_secret: OAUTH_CONSUMER_SECRET
        redirect_uri: URL.REDIRECT

    result.done (accessToken) =>
      if not accessToken
        console.debug "accessToken is empty"
        return

      @oauthToken.set accessToken
      @fetchMe()
      if _.isFunction callback
        callback()
      return
    return

  claimRefreshToken: (callback) =>

    refreshToken = @refreshToken().get()
    if not refreshToken
      return

    result = $.ajax
      url: URL.TOKEN
      type: "POST"
      data:
        grant_type: "refresh_token"
        refresh_token: refreshToken
        client_id: OAUTH_CONSUMER_KEY
        client_secret: OAUTH_CONSUMER_SECRET
        redirect_uri: URL.REDIRECT

    result.done (accessToken) =>
      if not accessToken
        console.debug "accessToken is empty"
        return

      @oauthToken.set accessToken
      @fetchUnreadCount callback,
        refresh: true
      return
    return

  fetchUnreadCount: (callback, options) =>

    if not @isAuthenticated()
      if _.isFunction callback
        callback()
        return

    if not @isExpiresIn new Date()
      #refresh token
      if options?.refresh
        if _.isFunction callback
          callback()
          return

      @claimRefreshToken callback

    result = $.ajax
      url: URL.FETCH
      type: "GET"

    result.done (data) =>
      if data?.result? and not _.isArray data.result.groups
        console.debug "groupList is not Array"
        console.debug data;
        return;

      groupList = data.result.groups
      unreadCount = 0

      @groupList.set groupList

      for group in groupList
        unreadCount = @countUpUnread unreadCount, group

      if _.isFunction callback
        callback unreadCount
      return
    return

  fetchMe: (callback, options) =>

    result = $.ajax
      url: URL.ME
      type: "GET"

    result.done (data) =>
      if data?.result? and not _.isObject data.result
        console.debug "me is empty"
        console.debug data;
        return

      @accounts.set data.result
      return
    return

  countUpUnread: (unreadCount, group) ->
    if not _.isObject group
      console.debug "group is not Object: #{group}"
      return unreadCount

    if group.unread_off is true
      return unreadCount

    if not _.isNumber group.unread_counts
      console.debug "group.unread_counts is not Number: #{group.unread_counts}"
      return unreadCount

    unreadCount + group.unread_counts

  isAuthenticated: ->
    !!@oauthToken.get()

  isExpiresIn: (now) ->
    if not _.isDate now
      throw new Error "now is not Date: #{now}"

    oauthToken = @oauthToken.get()
    (parseInt oauthToken.createAt, 10) + (parseInt oauthToken.expires_in, 10) * 1000 >= now.getTime()

  clearAuthorization: ->
    @groupList.clear()
    @oauthToken.clear()
    @accounts.clear()

  groupList:
    KEY_NAME: "groupList"
    get: ->
      _groupList = localStorage.getItem @KEY_NAME
      if not _groupList
        console.debug "groupList is empty: #{_groupList}"
        return undefined

      _.map JSON.parse(_groupList), (group) ->

        #TODO co-meeting側で対応するまで変換する
        group.url = group.url.replace /^http:\/\//, "https://"
        group

    set: (_groupList) ->
      if not _groupList
        console.debug "groupList is empty: #{_groupList}"
      localStorage.setItem @KEY_NAME, JSON.stringify _groupList
      _groupList

    clear: ->
      localStorage.setItem @KEY_NAME, ""
      return

  oauthToken:
    KEY_NAME: "oauthToken"
    get: ->
      _oauthToken = localStorage.getItem @KEY_NAME
      if not _oauthToken
        console.debug "oauthToken is empty: #{_oauthToken }"
      if _oauthToken then JSON.parse _oauthToken else undefined

    set: (_oauthToken) ->
      if not _oauthToken
        console.debug "oauthTokenis empty: #{_oauthToken}"

      _oauthToken.createAt = new Date().getTime()
      localStorage.setItem @KEY_NAME, JSON.stringify _oauthToken
      _oauthToken

    clear: ->
      localStorage.setItem @KEY_NAME, ""
      return

  accessToken: =>
    get: =>
      _oauthToken = @oauthToken.get()
      if not _oauthToken?.access_token
        console.debug "access_token  is empty: #{_oauthToken}"
      _oauthToken.access_token

  refreshToken: =>
    get: =>
      _oauthToken = @oauthToken.get()
      if not _oauthToken?.refresh_token
        console.debug "refresh_token is empty: #{_oauthToken}"
      _oauthToken.refresh_token

  accounts:
    KEY_NAME: "accounts"
    get: ->
      _accounts = localStorage.getItem @KEY_NAME
      if not _accounts
        console.debug "Accounts is empty: #{_accounts}"
        return undefined
      _accountsObj = JSON.parse _accounts

      #TODO commeting側のAPIがおかしい？？
      _accountsObj.icon_url = _accountsObj.icon_url.replace /^http:\/\/www.co-meeting.com/, ""
      _accountsObj

    set: (_accounts) ->
      if not _accounts
        console.debug "Accounts is empty: #{_accounts}"
      localStorage.setItem @KEY_NAME, JSON.stringify _accounts
      _accounts

    clear: ->
      localStorage.setItem @KEY_NAME, ""
      return

window.comeetingNotifier = new ComeetingNotifier()

