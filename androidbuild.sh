#!/usr/bin/env bash

ORIG_JAR="platforms/android/ant-build/LiveWireApp-debug.apk"
TMP_JAR="release/LiveWireApp-tmp.apk"
RELEASE_JAR="release/LiveWireApp.apk"

# Build android
./node_modules/cordova/bin/cordova build android

mkdir -p release/

# Copy jar to release
cp "$ORIG_JAR" "$TMP_JAR"

# Remove debug sign
zip -d "$TMP_JAR" "META-INF*"

# Sign Jar
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore livewire-release-key.keystore "$TMP_JAR" livewire -storepass 'HfZTuKiHxZL4D7hOcX55p883%j' -keypass 'HfZTuKiHxZL4D7hOcX55p883%j'

# Zipalign
zipalign -v 4 "$TMP_JAR" "$RELEASE_JAR"

rm "$TMP_JAR"
