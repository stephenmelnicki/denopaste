#!/bin/bash
set -e

if [ -f $DB_PATH ]; then
  echo "Database already exists, skipping restore"
else
  echo "No database found, restoring from replica if exists"
  litestream restore -if-replica-exists "${DB_PATH}"
fi

exec litestream replicate -exec "deno task preview"
