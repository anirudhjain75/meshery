#!/bin/bash
# Builds current committed master branch from GitHub to gh-pages, replacing
# everything in gh-pages. Intended to be run locally when you want to publish.
# Run with the version number as a parameter.

# Variables
installed="bundle"
version=$1

# Get the latest commit SHA in sourcedir branch
last_SHA=( $(git log -n 1 --pretty=oneline) )
# The name of the temporary folder will be the
#   last commit SHA, to prevent possible conflicts
#   with other folder names.
clone_dir="/tmp/clone_$last_SHA/"
echo $last_SHA

# Make sure Jekyll is installed locally
if ! gem list $installed; then
        echo "You do not have the pre-reqs installed. Refer to the README for
requirements."
        exit 0
fi

# Create directory to hold temporary clone
mkdir $clone_dir
cd $clone_dir
# Clone a clean copy of master from GitHub
git clone https://github.com/anirudhjain75/meshery
cd meshery/docs
# Variable for temporary build output files location
build_dir="/tmp/build_$last_SHA"
echo $build_dir
# Check out the branch containing versioned content for site
git checkout stable/$version
bundle install
bundle exec jekyll build \
--config _config.yml \
-b /version/$version \
-d $build_dir/$version/ > /dev/null 2>&1
if [ $? = 0 ]; then
  echo "Jekyll build successful for " $version
else
   echo "Jekyll build failed for " $version
   exit 1
fi
# Check out origin gh-pages branch
echo "Checking out gh-pages branch"
git checkout gh-pages
# Copy all the built files from where it was built to
echo "Copy build dir"
cp -r $build_dir .
echo "Adding files to commit"
# Because you don't want to add root files, add only the version folder
git add $version/
# Provides a publishing date stamp
publishdate=`date +%m-%d-%Y`
echo $publishdate
echo $last_SHA
# Commit the changed files
echo "Committing files"
git commit -a -m "Publishing master to GitHub Pages on $publishdate with
$last_SHA"
echo "Files committed, pushing to GitHub Pages."
git push origin gh-pages 
echo "Push complete. Check https://anirudhjain75.github.io/meshery/
for updates."
echo "Moving built files so that you can troubleshoot if needed."
mkdir -p /tmp/archive/
mv $clone_dir /tmp/archive/$last_SHA
rm -rf /tmp/$build_dir/
echo "Switch to the /tmp/archive/ directory and look for the directory "
echo "named with the latest commit SHA, "
echo "found by running git log -n 1 --pretty=oneline."