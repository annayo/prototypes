# Default settings for online
import original_settings

_old_middleware = original_settings.MIDDLEWARE_CLASSES

MIDDLEWARE_CLASSES = tuple([
    'django.middleware.cache.UpdateCacheMiddleware'] +
    list(original_settings.MIDDLEWARE_CLASSES) +
    ['django.middleware.cache.FetchFromCacheMiddleware'])
CACHE_MIDDLEWARE_SECONDS = 60
CACHE_MIDDLEWARE_ANONYMOUS_ONLY = True
