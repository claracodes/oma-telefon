class UserSerializer < ActiveModel::Serializer
  attributes %i(email name senior address latitude longitude)
end