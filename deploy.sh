#!/bin/bash
echo "Starting deploy";

# @todo Maybe add real version numbers in some other way
version=$(date +%s);

# Checkout the git repo with the generated source code
git clone --depth=0 git@github.com:Agigen/Generated-Site.git release

# Generate the css
sass -I sass sass/agigen.scss --style compressed > site/static/css/agigen.css

# And then generate the markup
hugo --source=site --destination=../release/site

# Add the generated source to a commit, create a tag and push it to github
cd release
git add site
git commit -am"Release of site version $version"
git tag -a "Release_$version" -m"Release $version of Agigen website"
git push --tags

# Cleanup
cd ..
rm -rf release

# And be happy
echo "Done!"
