class OrderSerializer < ActiveModel::Serializer
  attributes :id, :list, :status, :total
  belongs_to :owner, serializer: UserSerializer
  belongs_to :shopper, serializer: UserSerializer
end