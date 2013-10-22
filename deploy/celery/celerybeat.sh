#!/bin/sh -e
# Adapted from https://github.com/ask/celery/blob/master/contrib/generic-init.d/

getproparg() {
    val=`svcprop -p $1 $SMF_FMRI`
    [ -n "$val" ] && echo $val
}

if [ -z $SMF_FMRI ]; then
    echo "SMF framework variables are not initialized."
    exit $SMF_EXIT_ERR
fi

DEFAULT_PID_FILE="/var/run/celerybeat.pid"
DEFAULT_LOG_FILE="/var/log/celerybeat.log"
DEFAULT_LOG_LEVEL="INFO"
DEFAULT_SCHEDULE="/var/run/celerybeat-schedule"
DEFAULT_PYTHON="python"

PID_FILE=$(getproparg celerybeat/pid_file)
LOG_FILE=$(getproparg celerybeat/log_file)
LOG_LEVEL=$(getproparg celerybeat/log_level)
SCHEDULE=$(getproparg celerybeat/schedule)
PYTHON=$(getproparg celerybeat/python)

PYTHON=${PYTHON:-$DEFAULT_PYTHON}
PID_FILE=${PID_FILE:-$DEFAULT_PID_FILE}
LOG_FILE=${LOG_FILE:-$DEFAULT_LOG_FILE}
LOG_LEVEL=${LOG_LEVEL:-$DEFAULT_LOG_LEVEL}
SCHEDULE=${SCHEDULE:-$DEFAULT_LOG_SCHEDULE}

COMMAND_PREFEX=$(getproparg celerybeat/command_prefix)
COMMAND="$PYTHON $COMMAND_PREFEX celerybeat"

# New Relic enviroment variables - do NOT rename!
NEW_RELIC_ENVIRONMENT=production
NEW_RELIC_CONFIG_FILE=/srv/active/deploy/newrelic/newrelic.ini
# New Relic startup script
NEW_RELIC_ADMIN=/srv/active/env/bin/newrelic-admin

if [ -f $NEW_RELIC_CONFIG_FILE ] && [ -f $NEW_RELIC_ADMIN ]
then
    export NEW_RELIC_ENVIRONMENT
    export NEW_RELIC_CONFIG_FILE
    COMMAND=$NEW_RELIC_ADMIN" run-program "$COMMAND
fi

check_dev_null() {
    if [ ! -c /dev/null ]; then
        echo "/dev/null is not a character device!"
        exit 1
    fi
}

wait_pid () {
    pid=$1
    forever=1
    i=0
    while [ $forever -gt 0 ]; do
        kill -0 $pid 1>/dev/null 2>&1
        if [ $? -eq 1 ]; then
            echo "OK"
            forever=0
        else
            kill -TERM "$pid"
            i=$((i + 1))
            if [ $i -gt 60 ]; then
                echo "ERROR"
                echo "Timed out while stopping (30s)"
                forever=0
            else
                sleep 0.5
            fi
        fi
    done
}


stop_beat () {
    echo -n "Stopping celerybeat... "
    if [ -f "$PID_FILE" ]; then
        wait_pid $(cat "$PID_FILE")
    else
        echo "NOT RUNNING"
    fi
}

start_beat () {
    echo "Starting celerybeat..."
    $COMMAND --detach                  \
             --pidfile="$PID_FILE"     \
             --logfile="$LOG_FILE"     \
             --loglevel="$LOG_LEVEL"   \
             --schedule="$SCHEDULE"
}


case "$1" in
  start)
    check_dev_null
    start_beat
    ;;
  stop)
    stop_beat
    ;;
  restart)
    stop_beat
    check_dev_null
    start_beat
    ;;

  *)
    echo "Usage: /etc/init.d/celerybeat {start|stop|restart}"
    exit 1
esac

exit 0
