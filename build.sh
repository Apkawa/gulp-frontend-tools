#!/usr/bin/env bash
# Скрипт для переключения веток uds2 и frontend  и мержинга
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PROJECT_ROOT="$SCRIPT_DIR"

TYPE=$1

cd $PROJECT_ROOT

# update deps
npm install

function build {
    project=$1
    cmd_clean="gulp --project=${project} clean"
    cmd_build="gulp --project=${project} --type=$TYPE"
    echo $cmd_clean "&&" $cmd_build;
    $cmd_clean && $cmd_build
}

cd $PROJECT_ROOT
build example
