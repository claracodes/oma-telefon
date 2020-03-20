class Order < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :shopper, class_name: "User"

  enum state: { open: 1, accepted: 2, shopping_done: 3, delivered: 4 }

  validates :list, presence: true

end
