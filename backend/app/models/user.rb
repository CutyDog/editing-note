# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
class User < ApplicationRecord
  has_secure_password

  has_one :profile, dependent: :destroy
  has_many :refresh_tokens, dependent: :destroy
  has_many :pages, dependent: :destroy
  has_many :favorite_pages, dependent: :destroy
  has_many :page_views, dependent: :destroy

  validates :email, presence: true,
                    uniqueness: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  normalizes :email, with: ->(email) { email.strip.downcase }

  def profile_or_dummy
    profile || Profile::Dummy.new(self)
  end
end
