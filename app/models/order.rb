class Order < ApplicationRecord
  belongs_to :owner, class_name: "User"
  belongs_to :shopper, class_name: "User", optional: true

  enum status: { open: 1, accepted: 2, shopping_done: 3, delivered: 4, problem: 5 }
end
