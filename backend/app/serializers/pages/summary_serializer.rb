# frozen_string_literal: true

module Pages
  # ページ一覧・children で使う軽量表現
  class SummarySerializer
    include Alba::Resource

    attributes :id, :title, :position, :parent_id, :created_at, :updated_at
  end
end
