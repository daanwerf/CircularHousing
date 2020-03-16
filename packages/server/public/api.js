$.fn.api.settings.api = {
  'get participants': '/participant/getAll/{org}/{user}',
  'register participant': '/participant/register',
  'get items': '/item/getAll/{org}/{user}',
};

$('#load-participants').api({
  action: 'get participants',
  urlData: {//TODO remove code
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

$('#load-items').api({
  action: 'get items',
  urlData: {
    org: "SocialHousing",
    user: "Sultan"//TODO hardcoded username
  },
  onSuccess(res) {
    $('.cards').empty();
    $.each(res, function (index, item) {
      $('.cards').append(`
      <div class="card">
            <div class="content">
              <div class="header">${item._name}</div>
              <div class="meta">${item._id}</div>
              <div class="description">
                <p>
                Created: ${item._created}<br>
                Description: <br>
                Quality: ${item._quality}<br>
                Owner: ${item._owner}<br>
                </p>
              </div>
            </div>
          </div>`);
    });
  }
});

$('form .submit.button').api({
  action: 'register participant',
  method: 'POST',
  data: {
    org: "SocialHousing"//TODO hardcoded org
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
