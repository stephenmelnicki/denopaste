#!/bin/bash
set -e

readonly DB_PATH="/data/pastes.db"
export DB_PATH

if [ -f $DB_PATH ]; then
  echo "Database already exists, skipping restore"
else
  echo "No database found, restoring from replica if exists"
  litestream restore -if-replica-exists "${DB_PATH}"
fi

exec litestream replicate -exec "deno task preview"
