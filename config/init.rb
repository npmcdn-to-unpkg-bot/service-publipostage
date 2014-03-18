# -*- coding: utf-8 -*-

# DIR Method
def __DIR__(*args)
  filename = caller[0][/^(.*):/, 1]
  dir = File.expand_path(File.dirname(filename))
  ::File.expand_path(::File.join(dir, *args.map{|a| a.to_s}))
end

puts "loading configuration"
require __DIR__('env')
require __DIR__('CASLaclasseCom')
require __DIR__('database.rb')
require __DIR__('annuaire')


