class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.text :list
      t.integer :status, default: 1
      t.references :owner, null: false
      t.references :shopper, null: false

      t.timestamps
    end
    add_foreign_key :orders, :users, column: :owner_id, primary_key: :id
    add_foreign_key :orders, :users, column: :shopper_id, primary_key: :id
  end
end
