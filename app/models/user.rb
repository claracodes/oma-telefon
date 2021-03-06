class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :shopping_orders, class_name: 'Order', foreign_key: 'shopper_id'
  has_many :open_orders, class_name: 'Order', foreign_key: 'owner_id'

  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  # validates :call_s_id, presence: true
end
