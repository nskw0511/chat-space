class UsersController < ApplicationController

  def index
    @message = Message.new
    @messages = @group.messages.includes(:user)
    @members = @group.users
    respond_to do |format|
      format.html
      format.json { @messages = @messages.where("id > ?", params[:last_id]) }
    end
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end