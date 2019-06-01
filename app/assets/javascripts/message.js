function setIntervalAndExecute(fn, t) {
  fn();
  return(setInterval(fn, t));
}

function buildHTML(message){
  image = ( message.image ) ? `<asset_path src=${message.image} >` : "";
    var html =
      `<div class="message" data-message-id= "${message.id}">
        <div class="upper-message">
          <div class="upper-message__user-name">
            ${message.user_name}
          </div>
          <div class="upper-message__date">
            ${message.date}
          </div>
        </div>
        <div class="lower-meesage">
          <p class="lower-message__content">
            ${message.content}
          </p>
        </div>
        ${image}
      </div>`
  return html;
}

function ScrollToNewMessage(){
  $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
}

$(document).on("turbolinks:load", function() {
  $('#new_message').on('submit',function(e) {
    e.preventDefault(); 
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
	  .done(function(data){
		  var html = buildHTML(data);
	  	$('.messages').append(html);
      ScrollToNewMessage();
	  	$('.form__message').val('');
	  	$(".form__submit").prop('disabled', false);
	  })
	  .fail(function(){
	    alert('error');
	  });
  });

  var interval = setIntervalAndExecute(function() {
    if (!window.location.href.match(/\/groups\/\d+\/messages/)) {
      return;
    }

    var last_message_id = $('.message').filter(":last").data('messageId');
    $.ajax({
      url: `${location.href}.json`,
      type: "GET",
      data: { last_id: last_message_id },
      dataType: 'json'
    })
    .done(function(data){
      var insertHTML = '';
      data.forEach(function(message) {
        insertHTML = buildHTML(message);
        $('.messages').append(insertHTML)
      });
      ScrollToNewMessage();
    })
    .fail(function(data){
      alert('自動更新に失敗しました');
    })
  } , 5000)
});

