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
      if _.isFunction callback
        callback()
    return

  claimRefreshToken: (callback) =>

    refreshToken = @refreshToken.get()
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

  fetchUnreadCount: (callback, options) =>

    if not @isAuthenticated()
      if _.isFunction callback
        callback()
        return

    if not @isExpiresIn new Date()
      #refresh token
      if options.refrash
        if _.isFunction callback
          callback()
          return

      claimRefreshToken callback

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

      for group in @groupList
        unreadCount = @countUpUnread unreadCount, group

      if _.isFunction callback
        callback unreadCount
      return

  countUpUnread: (unreadCount, group) ->
    if not _.isObject group
      console.debug "group is not Object: #{group}"
      return unreadCount

    if group.unread_off is true
      return unreadCont

    if not _.isNumber group.unread_off
      console.debug "group.unread_off is not Number: #{group.unread_off}"
      return unreadCont

    unreadCount + group.unread_off

  isAuthenticated: ->
    !!@oauthToken.get()

  isExpiresIn: (now) ->
    if not _.isDate now
      throw new Error "module.isAuthenticated():now is not Date: #{now}"

    oauthToken = @oauthToken.get()
    (parseInt oauthToken.createAt, 10) + (parseInt oauthToken.expires_in, 10) * 1000 >= now.getTime()

  clearAuthorization: ->
    @groupList.clear()
    @oauthToken.clear()

  groupList:
    KEY_NAME: "groupList"
    get: ->
      _groupList = localStorage.getItem @KEY_NAME
      if not _groupList
        console.debug "groupList is empty: #{_groupList}"
      if not _.isArray _groupList
        console.debug "groupList is not Array: #{_groupList}"
      if _groupList then JSON.parse _groupList else undefined

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

window.comeetingNotifier = new ComeetingNotifier()

