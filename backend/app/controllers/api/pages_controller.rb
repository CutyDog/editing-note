# frozen_string_literal: true

module Api
  class PagesController < ApplicationController
    before_action :set_page, only: %i[show update destroy]

    # GET /api/pages
    def index
      pages = current_user.pages
                          .where(parent_id: nil)
                          .order(:position, :created_at)
      render json: Pages::SummarySerializer.new(pages).to_h
    end

    # GET /api/pages/:id
    def show
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

    def set_page
      @page = current_user.pages.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "ページが見つかりません" }, status: :not_found
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
