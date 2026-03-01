# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProfileSerializer do
  let(:user) { create(:user) }
  let(:dummy_profile) { Profile::Dummy.new(user) }

  describe "シリアライズ" do
    context "ダミープロファイル（Profile::Dummy）の場合" do
      it "正しくシリアライズされること" do
        serialized = described_class.new(dummy_profile).to_h
        expect(serialized.keys).to contain_exactly("name", "created_at", "updated_at")
        expect(serialized["name"]).to eq("No Name")
      end
    end

    context "実際のプロファイル（ARモデル）の場合" do
      let(:profile) { create(:profile, user: user, name: "Test Name") }

      it "正しくシリアライズされること" do
        serialized = described_class.new(profile).to_h
        expect(serialized.keys).to contain_exactly("name", "created_at", "updated_at")
        expect(serialized["name"]).to eq("Test Name")
      end
    end
  end
end
