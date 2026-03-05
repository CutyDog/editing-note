# frozen_string_literal: true
# rbs_inline: enabled

module Api
  class PagesController < ApplicationController
    before_action :set_page, only: %i[show update destroy]

    # GET /api/pages
    def index
      pages = fetch_pages
      pages = pages.preload(:favorite_pages).limit(100)
      render json: Pages::SummarySerializer.new(pages, params: { current_user: }).to_h
    end

    # GET /api/pages/recent
    def recent
      pages = current_user.pages
                          .joins(:page_views)
                          .order("page_views.last_viewed_at DESC")
                          .limit(10)
                          .preload(:favorite_pages)

      render json: Pages::SummarySerializer.new(pages, params: { current_user: }).to_h
    end

    # GET /api/pages/:id
    def show
      record_view(@page)
      render json: Pages::DetailSerializer.new(@page).to_h
    end

    # POST /api/pages
    def create
      page = current_user.pages.build(page_params)
      if page.save
        render json: Pages::BaseSerializer.new(page).to_h, status: :created
      else
        render json: { errors: page.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH /api/pages/:id
    def update
      if @page.update(page_params)
        render json: Pages::BaseSerializer.new(@page).to_h
      else
        render json: { errors: @page.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/pages/:id
    def destroy
      @page.destroy!
      head :no_content
    end

    private

    # @return [ActiveRecord::Relation]
    def fetch_pages
      if params[:q].present?
        ::PageSearchService.new(current_user).search(params[:q])
      else
        # フロントエンドでツリー構造を構築するため、全ページを返す
        current_user.pages.order(:position, :created_at)
      end
    end

    def set_page
      @page = current_user.pages.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "ページが見つかりません" }, status: :not_found
    end

    def record_view(page)
      view = current_user.page_views.find_or_initialize_by(page: page)
      view.last_viewed_at = Time.current
      view.save!
    rescue StandardError => e
      # 閲覧ログの記録失敗はメインの処理を止めない
      Rails.logger.error "最近見たページの記録に失敗しました: #{e.message}"
    end

    def page_params
      permitted = params.require(:page).permit(:title, :parent_id, :position).to_h
      if params[:page].key?(:content)
        content = params[:page][:content]
        permitted[:content] = safe_parse_content(content)
      end
      permitted
    end

    # `content` パラメータが不正な形式で送信された場合を考慮して、安全にパースする
    def safe_parse_content(content)
      if content.is_a?(Array)
        content.map { |c| c.respond_to?(:to_unsafe_h) ? c.to_unsafe_h : c }
      else
        content.respond_to?(:to_unsafe_h) ? content.to_unsafe_h : content
      end
    end
  end
end
