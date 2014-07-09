#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'

require 'xcodeproj'
xcproj = Xcodeproj::Project.open("platforms/ios/LiveWireApp.xcodeproj")
xcproj.recreate_user_schemes
xcproj.save