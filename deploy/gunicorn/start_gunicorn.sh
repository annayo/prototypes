# Customize this script if need to launch a configurable conf file. EI: -c `hostname`.py

COMMAND="/srv/active/env/bin/gunicorn_django -D -c /srv/active/deploy/gunicorn/gunicorn.py /srv/active/project/settings/__init__.py"

# New Relic enviroment variables - do NOT rename!
NEW_RELIC_ENVIRONMENT=production
NEW_RELIC_CONFIG_FILE=/srv/active/deploy/newrelic/newrelic.ini
# New Relic startup script
NEW_RELIC_ADMIN=/srv/active/env/bin/newrelic-admin

if [ -f $NEW_RELIC_CONFIG_FILE ] && [ -f $NEW_RELIC_ADMIN ]
then
    export NEW_RELIC_ENVIRONMENT
    export NEW_RELIC_CONFIG_FILE
    exec $NEW_RELIC_ADMIN run-program $COMMAND
else
    exec $COMMAND
fi
