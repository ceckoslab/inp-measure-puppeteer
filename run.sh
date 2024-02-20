#!/bin/bash

# Define the path to the Puppeteer script
PUPPETEER_SCRIPT="index.js"

# Check if the Puppeteer script file exists
if [ ! -f "$PUPPETEER_SCRIPT" ]; then
    echo "Error: Puppeteer script does not exist."
    exit 1
fi

# Run the Puppeteer script 10 times
for i in {1..10}; do
    echo "Running Puppeteer script, iteration $i"
    node "$PUPPETEER_SCRIPT" $1
done

echo "Script completed."

$SHELL