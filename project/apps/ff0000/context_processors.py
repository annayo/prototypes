# This context processor allows templates to simply access Django settings
# For exaxmple: {% if settings.ENVIRONMENT == 'development' %} {% endif %}
# Only the settings specified in settings.SETTINGS will be passed
from django.conf import settings as _settings

def settings(request):

    values = {}
    try:
        for v in _settings.VIEW_SETTINGS:
            values[v] = getattr(_settings, v)
    except AttributeError:  # no SETTINGS in Django settings
        pass
    return {'settings': values}

def base_template(request):
    """
    This context processor sets the base_template
    that should be used as the base template.

    Allows for different bases for ajax and html
    requests.
    """

    base_ajax = getattr(settings, 'BASE_AJAX_TEMPLATE', 'base_ajax.html')
    base_html = getattr(settings, 'BASE_HTML_TEMPLATE', 'base.html')

    if request.is_ajax():
        template = base_ajax
    else:
        template = base_html
    return {
        'base_template' : template
    }
