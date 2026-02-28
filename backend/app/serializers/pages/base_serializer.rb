# frozen_string_literal: true

module Pages
  # 作成・更新レスポンス用
  class BaseSerializer
    include Alba::Resource

    attributes :id, :title, :content, :position, :parent_id, :created_at, :updated_at
  end
end
