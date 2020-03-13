$.fn.api.settings.api = {
  'get participants': '/participant/getAll',
  'register participant': '/participant/register'
};

$('#load-participants').api({
  action: 'get participants',
  onSuccess(res) {
    $('.list').empty();
    $.each(res, function (index, item) {
      $('.list').append(`<div class='item'><div class='content'>${item._name}</div></div>`);
    });
  }
});

$(document).ready(function () {
  refreshParticipantsList();
});

$('form .submit.button').api({
  action: 'register participant',
  method: 'POST',
  serializeForm: true,
  onsuccess(response) {
    console.log(JSON.stringify(response));
    refreshParticipantsList();
  }
});
