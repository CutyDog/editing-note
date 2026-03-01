# frozen_string_literal: true

require "rails_helper"

RSpec.describe PageSearchService do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:service) { described_class.new(user) }

  describe "#search" do
    let!(:page1) { create(:page, user: user, title: "Ruby on Rails guide", content: [ { type: "paragraph", text: "Some text" } ]) }
    let!(:page2) { create(:page, user: user, title: "React notes", content: [ { type: "paragraph", text: "Ruby is great" } ]) }
    let!(:page3) { create(:page, user: user, title: "Docker info", content: [ { type: "paragraph", text: "Containers" } ]) }
    let!(:other_page) { create(:page, user: other_user, title: "Ruby is fun") }

    context "検索クエリが空の場合" do
      it "空のRelationを返すこと" do
        expect(service.search("")).to be_empty
        expect(service.search(nil)).to be_empty
      end
    end

    context "検索クエリが指定された場合" do
      it "タイトルまたはコンテントに部分一致する自分自身のページのみを返すこと" do
        results = service.search("Ruby")
        expect(results).to contain_exactly(page1, page2)
      end

      it "大文字小文字を区別せずに検索できること" do
        results = service.search("ruby")
        expect(results).to contain_exactly(page1, page2)
      end
    end
  end
end
