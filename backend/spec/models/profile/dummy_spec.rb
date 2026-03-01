# frozen_string_literal: true

require "rails_helper"

RSpec.describe Profile::Dummy, type: :model do
  let(:user) { create(:user) }
  let(:dummy) { described_class.new(user) }

  describe "#initialize" do
    it "ユーザーのidをuser_idにセットする" do
      expect(dummy.user_id).to eq(user.id)
    end

    it "idを0にセットする" do
      expect(dummy.id).to eq(0)
    end

    it "nameを'No Name'にセットする" do
      expect(dummy.name).to eq("No Name")
    end

    it "created_atにタイムスタンプをセットする" do
      expect(dummy.created_at).to be_present
    end

    it "updated_atにタイムスタンプをセットする" do
      expect(dummy.updated_at).to be_present
    end
  end

  describe "ActiveModelの互換性" do
    it "attributesメソッドを持つ" do
      expect(dummy.attributes).to include("name" => "No Name")
    end
  end
end
