class Api::V1::OrdersController < ApplicationController
  skip_before_action :authenticate_user!, only: %i(index show)
  skip_before_action :verify_authenticity_token, if: ->{ request.format.json? }

  RANGE = 5

  def index
    # orders = policy_scope(Order).where(status: :open).order(created_at: :asc)
    if params[:latitude].present? && params[:longitude].present?
      user_ids = User.near([params[:latitude], params[:longitude]], RANGE, units: :km, order: '').ids
      orders = Order.where(status: :open, owner_id: user_ids).order(created_at: :asc)
    else
      orders = Order.where(status: :open).order(created_at: :asc)
    end

    render json: orders, each_serializer: OrderSerializer
  end

  def show
    # authorize order
    render json: order
  end

  def accept
    order.update(shopper_id: current_user.id, status: :accepted)

    render json: order
  end

  def shopping_done
    order.update(status: :shopping_done, total: params[:total])

    # Schedule twilio call / bg job
    ConfirmOrderJob.perform_later(order.id)

    render json: order
  end

  def delivered
    if params[:money_received]
      order.update(status: :delivered)
    else
      order.update(status: :problem)
    end

    render json: order
  end

  private

  def order
    Order.find(params[:id])
  end
end
