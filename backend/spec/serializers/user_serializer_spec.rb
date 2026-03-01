# frozen_string_literal: true

require "rails_helper"

RSpec.describe UserSerializer do
  let(:user) { create(:user) }

  describe "シリアライズ" do
    context "ユーザーが物理的なプロファイル（DBレコード）を持たない場合" do
      it "ダミープロファイルを使ってシリアライズされること" do
        serialized = described_class.new(user).to_h
        expect(serialized.keys).to contain_exactly("id", "email", "created_at", "updated_at", "profile")
        expect(serialized["profile"]["name"]).to eq("No Name")
      end
    end

    context "ユーザーが物理的なプロファイル（DBレコード）を持つ場合" do
      before do
        create(:profile, user: user, name: "Real Name")
        user.reload
      end

      it "物理的なプロファイルを使ってシリアライズされること" do
        serialized = described_class.new(user).to_h
        expect(serialized["profile"]["name"]).to eq("Real Name")
      end
    end
  end
end
