#!/bin/bash

API_URL="https://placementscore.online/api/admin/backfill"
AUTH_HEADER="Authorization: Bearer my_super_secret_123"

# Function to generate blog
gen_blog() {
  DATE=$1
  TOPIC=$2
  echo "Generating: $TOPIC for $DATE"
  curl -X POST -H "$AUTH_HEADER" -H "Content-Type: application/json" -d "{\"date\": \"$DATE\", \"topic\": \"$TOPIC\"}" $API_URL
  echo ""
  sleep 5 # Wait to avoid rate limits
}

# Feb 1-15 (1 per day)
gen_blog "2026-02-01T10:00:00Z" "ATS resume score explained"
gen_blog "2026-02-02T10:00:00Z" "Resume format for freshers 2026"
gen_blog "2026-02-03T10:00:00Z" "Resume keywords for TCS"
gen_blog "2026-02-04T10:00:00Z" "Resume keywords for Infosys"
gen_blog "2026-02-05T10:00:00Z" "Resume rejection reasons"
gen_blog "2026-02-06T10:00:00Z" "Resume summary examples"
gen_blog "2026-02-07T10:00:00Z" "Resume mistakes freshers make"
gen_blog "2026-02-08T10:00:00Z" "Resume format for BTech students"
gen_blog "2026-02-09T10:00:00Z" "Resume for campus placements"
gen_blog "2026-02-10T10:00:00Z" "Resume for Google internship India"
gen_blog "2026-02-11T10:00:00Z" "ATS friendly resume template"
gen_blog "2026-02-12T10:00:00Z" "Resume achievements examples"
gen_blog "2026-02-13T10:00:00Z" "Resume objective for freshers"
gen_blog "2026-02-14T10:00:00Z" "Resume for Wipro hiring"
gen_blog "2026-02-15T10:00:00Z" "Resume for Accenture recruitment"

# Feb 16 (2 blogs)
gen_blog "2026-02-16T09:00:00Z" "Resume checklist before placement"
gen_blog "2026-02-16T15:00:00Z" "Resume improvement tips 2026"

# Feb 17 (3 blogs)
gen_blog "2026-02-17T08:00:00Z" "Resume projects section guide"
gen_blog "2026-02-17T12:00:00Z" "Resume skills section optimization"
gen_blog "2026-02-17T16:00:00Z" "Resume headline examples"
