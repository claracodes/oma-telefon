Rails.application.routes.draw do
  get 'calls/incoming'
  devise_for :users
  root to: 'pages#home'

  get "listings", to: 'pages#listings'

  post 'incoming', to: 'calls#incoming'
  post 'phone_number', to: 'calls#phone_number'
  post 'name', to: 'calls#name'
  post 'list', to: 'calls#list'
  post 'address', to: 'calls#address'
  post 'order_option', to: 'calls#order_option'
  post 'confirm_order', to: 'calls#confirm_order'

  # API
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get 'my_orders', to: 'orders#my_orders'

      resources :orders, only: %i[index show] do
        member do
          put :accept
          put :shopping_done
          put :delivered
        end
      end
    end
  end

  # Sidekiq Web UI, only for admins.
  require "sidekiq/web"
  # authenticate :user, lambda { |u| u.admin } do
  mount Sidekiq::Web => '/sidekiq'
  # end
end
