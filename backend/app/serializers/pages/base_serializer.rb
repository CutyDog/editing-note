# frozen_string_literal: true
# rbs_inline: enabled

module Pages
  # 作成・更新レスポンス用
  class BaseSerializer < ::BaseSerializer
    attributes :id, :title, :content, :position, :parent_id, :created_at, :updated_at
  end
end
