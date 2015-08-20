begin; require 'rubygems'; rescue LoadError; end # rubocop:disable Lint/HandleExceptions

require 'rake'
require 'rake/clean'
# require 'rspec/core/rake_task'
# require 'resque/tasks'

Dir.glob(File.expand_path('../tasks/*.rake', __FILE__)).each do |f|
  import(f)
end
