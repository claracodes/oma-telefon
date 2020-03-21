Rails.application.routes.draw do
  get 'calls/incoming'
  devise_for :users
  root to: 'pages#home'

  post 'incoming', to: 'calls#incoming'
  post 'phone_number', to: 'calls#phone_number'
  post 'list', to: 'calls#list'
  post 'address', to: 'calls#address'
  post 'order_option', to: 'calls#order_option'

  get 'test_get', to: 'calls#test_get'

  # API
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :orders, only: %i[index show]
    end
  end
end
