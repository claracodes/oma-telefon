class Api::V1::OrdersController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    orders = policy_scope(Order).where(status: :open).order(created_at: :asc)
    render json: { data: orders.to_json }
  end

  def show
    order = Order.find(params[:id])
    authorize order
    render json: { data: order.to_json }
  end
end
