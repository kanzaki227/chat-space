class Api::MessagesController < ApplicationController
  def index
    group = Group.find(params[:group_id]) #今のグループの情報をparamsの値を元にデータベースから取得
    last_message_id = params[:id].to_i #paramsのidの数値をlast_message_id変数として定義
    @messages = group.messages.includes(:user).where("id > #{last_message_id}") #グループが所有するメッセージの中から,last_message_idより大きいidがないかをmessageから検索して@messagesに代入
  end
end