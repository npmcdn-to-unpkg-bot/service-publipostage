# -*- coding: utf-8 -*-

# DIR Method
def __DIR__(*args)
  filename = caller[0][/^(.*):/, 1]
  dir = File.expand_path(File.dirname(filename))
  ::File.expand_path(::File.join(dir, *args.map{|a| a.to_s}))
end

puts "loading config/env"
require __DIR__('env')

puts "loading config/CASLaclasseCom"
require __DIR__('CASLaclasseCom')

puts "loading database"
require __DIR__('database.rb')


