#!/bin/bash
echo "Starting deploy";

DIR="`dirname "${0}"`"

# @todo Maybe add real version numbers in some other way
version=$(date +"%y%m%d_%H%M");

# Checkout the git repo with the generated source code
git clone --depth=1 git@github.com:Agigen/Generated-Site.git /tmp/agigen-hugo-release

# Generate the css
sass -I sass sass/agigen.scss --style compressed > site/static/css/agigen.css

# And then generate the markup
hugo --source=site --destination=/tmp/agigen-hugo-release/site

# Add the generated source to a commit, create a tag and push it to github
cd /tmp/agigen-hugo-release
git add site
git commit -am"Release of site version $version"
git tag -a "$version" -m"Release $version of Agigen website"
git push --tags

# Cleanup
cd $DIR
rm -rf /tmp/agigen-hugo-release

# And be happy
echo "Done!"
