# -*- coding: utf-8 -*-
require 'sequel'
require 'mysql2'

DB = Sequel.mysql2(
  'publipostage',
  :user=>'root',
  :password=>'root',
  :charset=>'utf8')

DB.extension(:pagination)
Sequel.extension(:migration)