require 'rails_helper'

RSpec.describe Pages::SummarySerializer do
  let(:user) { create(:user) }
  let(:page) { create(:page, user: user, title: 'テストページ', position: 1) }
  let(:result) { described_class.new(page).to_h }

  it 'id, title, position, created_at, updated_at を返すこと' do
    expect(result).to match(a_hash_including(
      "id" => page.id,
      "title" => 'テストページ',
      "position" => 1
    ))
    expect(result).to include("created_at", "updated_at")
  end

  it 'content や parent_id を含まないこと' do
    expect(result).not_to include("content", "parent_id")
  end
end

RSpec.describe Pages::BaseSerializer do
  let(:user) { create(:user) }
  let(:page) { create(:page, user: user, title: 'ベースページ') }
  let(:result) { described_class.new(page).to_h }

  it 'id, title, content, position, parent_id, created_at, updated_at を返すこと' do
    expect(result).to match(a_hash_including(
      "id" => page.id,
      "title" => 'ベースページ',
      "position" => page.position,
      "parent_id" => nil
    ))
    expect(result).to include("content", "created_at", "updated_at")
  end
end

RSpec.describe Pages::DetailSerializer do
  let(:user) { create(:user) }
  let(:parent_page) { create(:page, user: user, title: '親ページ') }
  let!(:child1) { create(:page, user: user, parent: parent_page, title: '子ページ1', position: 0) }
  let!(:child2) { create(:page, user: user, parent: parent_page, title: '子ページ2', position: 1) }
  let(:result) { described_class.new(parent_page).to_h }

  it 'id, title, content, position, parent_id, created_at, updated_at を返すこと' do
    expect(result).to match(a_hash_including(
      "id" => parent_page.id,
      "title" => '親ページ',
      "parent_id" => nil
    ))
    expect(result).to include("content", "created_at", "updated_at")
  end

  it '子ページをposition順で含むこと' do
    children = result["children"]
    expect(children.length).to eq(2)
    expect(children.first["title"]).to eq('子ページ1')
    expect(children.second["title"]).to eq('子ページ2')
  end

  it '子ページはSummary形式（contentを含まない）であること' do
    expect(result["children"].first).not_to include("content", "parent_id")
  end
end
