class OrderSerializer < ActiveModel::Serializer
  attributes :id, :list, :status
  belongs_to :owner, serializer: UserSerializer
  belongs_to :shopper, serializer: UserSerializer
end