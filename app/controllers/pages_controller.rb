class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home, :listings]

  def home
  end

  def listings
    @users = User.where(senior: true)
    @orders = Order.all
  end
end
