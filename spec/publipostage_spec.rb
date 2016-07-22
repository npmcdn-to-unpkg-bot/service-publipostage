# coding: utf-8
require 'spec_helper'

describe 'Publipostage_Utils_Test' do
  it 'retourne la liste des etablissements et des regroupements' do
    listes = Publipostage::Utils.get_regroupements( MOCKED_DATA )
    expect(listes[:etablissements].size).to eq 2
    expect(listes[:regroupements].size).to eq 4
  end

  it 'tri et retourne les infos du personnel' do
    expect(Publipostage::Utils.get_personnels(PERSONNELS_DATA).size).to eq(10)
  end

  it 'renvoi la matiere avec un / si les conditions sont respéctées sinon elle renvoie vide' do
    expect(Publipostage::Utils.get_matiere_string(population: 'professors', matiere: 'anglais')).to eq('/anglais')
    expect(Publipostage::Utils.get_matiere_string(population: 'professors', matiere: '-1')).to eq('')
    expect(Publipostage::Utils.get_matiere_string(population: 'professors', matiere: nil)).to eq('')
    expect(Publipostage::Utils.get_matiere_string(population: 'directeurs', matiere: 'anglais')).to eq('')
  end

  it 'retourne un tableau vide si aucun établissement' do
    ret = Publipostage::Utils.get_regroupements( nil )
    expect(ret).to be_an Array
    expect(ret.size).to eq 0
  end
end
