#!/bin/bash
declare -a simulators=("975D5F01-7AD0-4AAD-ACBF-F9F300F1C77E")

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.19.1.tar.app
    xcrun simctl openurl $i exp://127.0.0.1:19000
done
