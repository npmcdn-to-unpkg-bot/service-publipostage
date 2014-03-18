#encoding: utf-8

require_relative 'spec_helper'


# test the authentication api without signing the request
# must comment before do block in auth.rb file 
# to pass test without singing
describe 'API' do
 include Rack::Test::Methods

  def app
    Rack::Builder.parse_file("config.ru").first
  end

  # to do test with real data

  before :all do
  end

  after :all do
    # empty alimented etablissement data
  end

  # problem to test with real data
  it "should return the list of publipostage" do
    get('/app/api/publipostages').status.should == 200
    JSON.parse(last_response.body).count.should == Publipostage.all.count
  end
end