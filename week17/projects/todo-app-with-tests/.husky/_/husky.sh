#!/bin/sh

if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  readonly hook_dir="$(dirname "$0")"
  readonly husky_dir="$(cd "$hook_dir/.." && pwd)"
  readonly package_dir="$husky_dir/.."

  export HUSKY=0
  export husky_skip_init=1
  sh -e "$husky_dir/$hook_name" "$@"
  exitCode=$?
  unset husky_skip_init
  debug "finished $hook_name, exit $exitCode"
  exit $exitCode
fi
