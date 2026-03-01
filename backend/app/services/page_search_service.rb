# frozen_string_literal: true
# rbs_inline: enabled

class PageSearchService
  #: (User user) -> void
  def initialize(user)
    @user = user
  end

  #: (String query) -> ActiveRecord::Relation
  def search(query)
    return @user.pages.none if query.blank?

    # TODO: 将来的にElasticsearchなどに移行しやすくするため、このクラスに検索処理を閉じ込める
    # current implementation uses basic SQL LIKE search
    @user.pages.where("title ILIKE :q OR content::text ILIKE :q", q: "%#{query}%").order(updated_at: :desc).limit(50)
  end
end
