# frozen_string_literal: true

module Api
  class FavoritePagesController < ApplicationController
    before_action :set_page

    # POST /api/pages/:page_id/favorite
    def create
      current_user.favorite_pages.find_or_create_by!(page: @page)
      head :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    # DELETE /api/pages/:page_id/favorite
    def destroy
      favorite = current_user.favorite_pages.find_by(page: @page)
      favorite&.destroy!
      head :no_content
    end

    private

    def set_page
      @page = current_user.pages.find(params[:page_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "ページが見つかりません" }, status: :not_found
    end
  end
end
