#!/usr/bin/env bash

# (OS X, Unix and Linux)
#
# What is this?
#
# It's a shell script that is using ImageMagick to create all the icon files from one source icon.
#
# Stick the script in your 'www/res/icons' folder with your source icon 'my-hires-icon.png' then trigger it from Terminal.
#

ICON_ANDROID=${1:-"my-hires-icon-android.png"}
ICON_IOS=${1:-"my-hires-icon-ios.png"}

mkdir -p android
convert $ICON_ANDROID -resize 36x36 android/icon-36-ldpi.png
convert $ICON_ANDROID -resize 48x48 android/icon-48-mdpi.png
convert $ICON_ANDROID -resize 72x72 android/icon-72-hdpi.png
convert $ICON_ANDROID -resize 96x96 android/icon-96-xhdpi.png

mkdir -p ios
convert $ICON_IOS -resize 29 ios/icon-29.png
convert $ICON_IOS -resize 40 ios/icon-40.png
convert $ICON_IOS -resize 50 ios/icon-50.png
convert $ICON_IOS -resize 57 ios/icon-57.png
convert $ICON_IOS -resize 58 ios/icon-29-2x.png
convert $ICON_IOS -resize 60 ios/icon-60.png
convert $ICON_IOS -resize 72 ios/icon-72.png
convert $ICON_IOS -resize 76 ios/icon-76.png
convert $ICON_IOS -resize 80 ios/icon-40-2x.png
convert $ICON_IOS -resize 100 ios/icon-50-2x.png
convert $ICON_IOS -resize 114 ios/icon-57-2x.png
convert $ICON_IOS -resize 120 ios/icon-60-2x.png
convert $ICON_IOS -resize 144 ios/icon-72-2x.png
convert $ICON_IOS -resize 152 ios/icon-76-2x.png
