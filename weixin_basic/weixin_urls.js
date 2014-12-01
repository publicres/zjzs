require('./access_token')
require('./custom_menu')

exports.WEIXIN_URLS = {
    'access_token': getAccessToken,
    'get_custom_menu': get_custom_menu_url_generator,
    'modify_custom_menu': modify_custom_menu_url_generator,
}