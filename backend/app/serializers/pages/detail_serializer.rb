# frozen_string_literal: true
# rbs_inline: enabled

module Pages
  # ページ詳細表示用（content・children を含む）
  class DetailSerializer < ::BaseSerializer
    attributes :id, :title, :content, :position, :parent_id, :created_at, :updated_at

    many :children, serializer: Pages::SummarySerializer do
      def children(page)
        page.children.order(:position, :created_at)
      end
    end
  end
end
