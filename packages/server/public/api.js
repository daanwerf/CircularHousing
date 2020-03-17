$.fn.api.settings.api = {
  'get participants': '/participant/getAll/{org}/{user}',
  'register participant': '/participant/register',
  'get items': '/item/getAll/{org}/{user}',
  'add item': '/item/add',
  'transfer ownership': '/item/transfer'
};

$('#load-participants').api({
  action: 'get participants',
  urlData: {//TODO remove code
    org: "WoodGatherer",
    user: "Tim"
  },
  onSuccess(res) {
    $('.list').empty();
    $.each(res, function (index, item) {
      $('.list').append(`<div class='item'><div class='content'><div class="header">${item._name}</div><div class="description">${item._id}</div></div></div>`);
    });
  }
});

$('#load-items').api({
  action: 'get items',
  urlData: {
    org: "WoodGatherer",
    user: "Tim"//TODO hardcoded username
  },
  onSuccess(res) {
    console.log(JSON.stringify(res));
    $('.cards').empty();
    $.each(res, function (index, item) {
      $('.cards').append(`
      <div class="card">
            <div class="content">
              <div class="header">${item._name}</div>
              <div class="meta">${item._id}</div>
              <div class="description">
                <p>
                Owner: ${item._itemOwner}
                Created: ${item._creationDate}<br>
                Quality: ${item._quality}<br>
                </p>
                Materials:
                <ul id="materials-${item._id}">
</ul>
              </div>
            </div>
          </div>`);
      if (item && item.hasOwnProperty("_materials")) {
        item._materials.forEach(function (material) {
          $(`#materials-${item._id}`).append(`<li>${material}</li>`);
        })
      }
    });
  }
});

$('form#participant-form .submit.button').api({
  action: 'register participant',
  method: 'POST',
  data: {
    org: "WoodGatherer"//TODO hardcoded org
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
      console.log(JSON.stringify(response));
      // cogoToast.error(response.message);
      $('.messages').append(`<div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
              Request failed
            </div>
            <p>${response.message}</p>
          </div>`);
      $('.message').show();
      refreshMessageHandler();
    }
  }
});


$('form#transfer-form .submit.button').api({
  action: 'transfer ownership',
  method: 'POST',
  data: {
    org: "WoodGatherer"//TODO hardcoded org
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
      console.log(JSON.stringify(response));
      // cogoToast.error(response.message);
      $('.messages').append(`<div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
              Request failed
            </div>
            <p>${response.message}</p>
          </div>`);
      $('.message').show();
      refreshMessageHandler();
    }
  }
});

$('form#item-form .submit.button').api({
  action: 'add item',
  method: 'POST',
  data: {
    org: "WoodGatherer"//TODO hardcoded org
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
      console.log(JSON.stringify(response));
      // cogoToast.error(response.message);
      $('.messages').append(`<div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
              Request failed
            </div>
            <p>${response.message}</p>
          </div>`);
      $('.message').show();
      refreshMessageHandler();
    }
  }
});

function refreshMessageHandler() {
  $('.message .close')
    .on('click', function () {
      $(this)
        .closest('.message')
        .transition('fade');
    });
}
