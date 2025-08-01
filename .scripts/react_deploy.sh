#!/bin/bash
set -e

echo "Deployment started ..."

# Pull the latest version of the app
echo "Copying New changes...."
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25520" git pull

echo "New changes copied to server !"

echo "Go To HMS"
cd HMS

echo "Installing Dependencies..."
npm init --yes


echo "Creating Production Build..."
npm run build

echo "Deployment Finished !"