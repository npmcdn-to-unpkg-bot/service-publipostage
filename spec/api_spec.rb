# encoding: utf-8

require_relative 'spec_helper'
require 'annuaire'

ANNUAIRE = {
  url: 'http://localhost:7000/api',
  app_id: 'Publi',
  api_key: 'I/Alnl8ank+zFW5ctT7F9531luQbzwem/mD84dEQ1DI='
}

# test the authentication api without signing the request
# must comment before do block in auth.rb file
# to pass test without singing
describe 'API' do
  include Rack::Test::Methods

  def app
    Rack::Builder.parse_file('config.ru').first
  end

  # to do test with real data

  before :all do
    Annuaire.configure do |config|
      config.app_id = ANNUAIRE[:app_id]
      config.api_key = ANNUAIRE[:api_key]
      config.api_url = ANNUAIRE[:url]
    end
  end

  after :all do
    # empty alimented etablissement data
  end

  # problem to test with real data
  it 'should return  a list of all publipostage' do
    lists =  Annuaire.send_request_signed(:service_annuaire_publipostage, nil, {})
    lists.count.should_not eq(0)
  end

  it 'should return the details of a specific publipostage' do
    pub = Annuaire.send_request_signed(:service_annuaire_publipostage, '1', {})
    pub[:id].should eq(1)
    pub[:descriptif].should_not be_nil
  end

  it 'should create a publipostage' do
  end

  it 'should modify a publipostage' do
  end

  it 'should delete a publipostage' do
  end
end
