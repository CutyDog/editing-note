# frozen_string_literal: true

module Api
  class MeController < ApplicationController
    def show
      render json: UserSerializer.new(current_user).to_h
    end

    def update
      ActiveRecord::Base.transaction do
        if params[:user].present? && user_params.values.any?(&:present?)
          current_user.update!(user_params)
        end
        if params[:profile].present? && profile_params.values.any?(&:present?)
          profile = current_user.profile || current_user.build_profile
          profile.update!(profile_params)
        end
      end

      render json: UserSerializer.new(current_user.reload).to_h
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    private

    def user_params
      # パスワードはオプションだが、存在する場合は更新可能
      permitted = params.require(:user).permit(:email, :password, :password_confirmation)
      # 不要なバリデーションエラーを防ぐため、空のパスワードフィールドを除外
      permitted.reject { |_, v| v.blank? }
    end

    def profile_params
      params.require(:profile).permit(:name)
    end
  end
end
