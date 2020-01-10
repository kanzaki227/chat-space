$(function(){

  function buildHTML(message){
    image = ( message.image ) ? `<img class="lower-message__image" src=${message.image} >` : ""; //三項演算子(投稿したimageが{message(json).image=>message.image.url}であることがtrueなら,画像のhtmlを表示,falseなら何も表示しない)　つまり画像のurlを投稿したときはそのurlを読んで画像で表示
                var html =  
                ` <div class="message" data-message-id="${message.id}">
                <div class="upper-message">
                  <div class="upper-message__user-name">
                    ${message.user_name}
                  </div>
                  <div class="upper-message__date">
                    ${message.date}
                  </div>
                </div>
                <div class="lower-message">
                  <p class="lower-message__content">
                  ${message.content}
                  </p>
                  ${image}
                </div>
              </div>`
          return html; //htmlをajaxに返す

    return html;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      url: window.location.pathname,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data)
      $('.messages').append(html)
      $('#new_message')[0].reset();
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
  
    })
    .fail(function(){
      alert('送信に失敗しました。');
    })
    .always(function(){
      $(".form__submit").removeAttr("disabled");
    });
  });


  $(function(){
    var reloadMessages = function(){  //自動更新の関数
      if (window.location.href.match(/\/groups\/\d+\/messages/)){ //今いるページのリンクが/groups/グループid/messagesであれば以下を実行
        var last_message_id = $('.message:last').data("message-id"); //dataメソッドで.messageにある:last(最後)のカスタムデータ属性を取得しlast_message_idに代入
        $.ajax({
          url: "api/messages", //サーバの指定(api/message_controller)
          type: 'get', //メソッド(get)
          dataType: 'json', //データの形式(json)
          data: {id: last_message_id} //飛ばすデータ(取得したlast_message_id)
        })
        .done(function(messages){ //自動更新成功の時の処理(controllerから受け取ったmessageを引数にする)
          var insertHTML = ''; //HTMLの入れ物
          messages.forEach(function(message){ //配列messagesの中身一つ一つをHTMLに変換して入れ物に足し合わせる
            insertHTML = buildHTML(message); //メッセージが入ったHTMLを取得 
            $(".messages").append(insertHTML); //メッセージを追加
            $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 50); //自動更新が成功した時(メッセージが送信できた時)のみ一番下までスクロールする
          })
        })

        .fail(function(){ //自動更新が失敗した時の処理
          alert('自動更新に失敗しました'); //アラートを出す
        });
      }
    };
    setInterval(reloadMessages, 7000); //7000ミリ秒(7秒)ごとにreloadMessages(自動更新の関数)を実行
  });
});