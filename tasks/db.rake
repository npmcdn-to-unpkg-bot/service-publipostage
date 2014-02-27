require 'sequel'
require 'tasks/sequel'
require 'mysql2'

task :environment do
  DB = Sequel.mysql2(
    'publipostage',
    :user=>'root',
    :password=>'root',
    :charset=>'utf8')
end

task :version => :load_config do
  dir = File.join(SEQUEL_PLUS_APP_ROOT, 'db', 'migrate')
  puts "Current Schema Version: #{::Sequel::Migrator.send(:migrator_class, dir).new(DB, dir).send(:current_migration_version)}"
end


