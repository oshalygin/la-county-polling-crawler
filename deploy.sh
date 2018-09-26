#!/bin/bash
#
# Deploy a cloud function to a named functions staging bucket

set -o nounset
set -o errexit -o errtrace

FUNCTIONS_BUCKET=crawler-dev-cloud-functions

gcloud beta functions deploy $1 --stage-bucket $FUNCTIONS_BUCKET --trigger-http --source=./dist/$2 --memory=2048MB --runtime nodejs8 --timeout=45