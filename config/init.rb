# -*- coding: utf-8 -*-

# DIR Method
def __DIR__(*args)              # rubocop:disable Style/MethodName
  filename = caller[0][/^(.*):/, 1]
  dir = File.expand_path(File.dirname(filename))
  ::File.expand_path(::File.join(dir, *args.map(&:to_s)))
end
require __DIR__('options')
