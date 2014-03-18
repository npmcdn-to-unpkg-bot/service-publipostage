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
  it "should return  a list of all publipostage" do
    get('/app/api/publipostages').status.should == 200
    JSON.parse(last_response.body).count.should == Publipostage.all.count
  end
  
  it "should return the details of a specific publipostage" do
    publi = Publipostage.first
    get("/app/api/publipostages/#{publi.id}").status.should == 200
  end
  
  it "should create a publipostage" do
    
  end
  
  it "should modify a publipostage" do
  end
  
  it "should delete a publipostage" do
  end 
end