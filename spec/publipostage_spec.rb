require 'spec_helper'

describe 'Lib_Publipostage_Test' do

	it "retourne la liste des etablissements et des regroupements" do
		listes = Lib::Publipostage.get_regroupements MOCKED_DATA
		expect(listes[:etablissements].size).to eq(2)
		expect(listes[:regroupements].size).to eq(4)
  end

  it "tri et retourne les infos du personnel" do
  	expect(Lib::Publipostage.get_personnels(PERSONNELS_DATA).size).to eq(10)
  end

  it "renvoi la matiere avec un / si les conditions sont respéctées sinon elle renvoie vide" do
  	expect(Lib::Publipostage.get_matiere_string({population: 'professors', matiere: "anglais"})).to eq('/anglais')
  	expect(Lib::Publipostage.get_matiere_string({population: 'professors', matiere: "-1"})).to eq('')
  	expect(Lib::Publipostage.get_matiere_string({population: 'professors', matiere: nil})).to eq('')
  	expect(Lib::Publipostage.get_matiere_string({population: 'directeurs', matiere: "anglais"})).to eq('')
  end
end