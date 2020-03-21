class UserSerializer < ActiveModel::Serializer
  attributes %i(email senior address latitude longitude)
end