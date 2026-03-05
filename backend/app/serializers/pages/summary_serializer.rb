# frozen_string_literal: true
# rbs_inline: enabled

module Pages
  # ページ一覧・children で使う軽量表現
  class SummarySerializer < ::BaseSerializer
    attributes :id, :title, :position, :parent_id, :created_at, :updated_at

    attribute :is_favorited do |page|
      params[:current_user]&.then { |u| page.favorited_by?(u) } || false
    end
  end
end
