# -*- coding: utf-8 -*-
require 'sequel'
require 'mysql2'

DB = Sequel.mysql2(
  'annuairev3',
  :user=>'root',
  :password=>'root',
  :charset=>'utf8')

Sequel.extension(:pagination)
Sequel.extension(:migration)