$.fn.api.settings.api = {
  'get participants': '/participant/getAll/{org}/{user}',
  'register participant': '/participant/register'
};

$('#load-participants').api({
  action: 'get participants',
  urlData: {
    org: "SocialHousing",
    user: "Sultan"
  },
  onSuccess(res) {
    $('.list').empty();
    $.each(res, function (index, item) {
      $('.list').append(`<div class='item'><div class='content'>${item._name}</div></div>`);
    });
  }
});

$('form .submit.button').api({
  action: 'register participant',
  method: 'POST',
  data: {
    org: "SocialHousing"
  },
  serializeForm: true,
  onComplete: function (response) {
    console.log(JSON.stringify(response))
  },
  onSuccess: function (response) {
    console.log("Success: " + JSON.stringify(response))
  },
  onFailure: function (response) {
    if (response) {
      console.log(JSON.stringify(response))
      $(".messages").append(`<div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
              Request failed
            </div>
            <p>${response.message}</p>
          </div>`)
      refreshMessageHandler();
    }
  }
});

function refreshMessageHandler() {
  $('.message .close')
    .on('click', function () {
      $(this)
        .closest('.message')
        .transition('fade')
      ;
    });
}
