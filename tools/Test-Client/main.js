$(document).ready(function () {
  prepareToConnect();
});

function prepareToConnect() {
  $('#connect').text('connect').unbind('click').click(function () {
    $('#connect').text('connecting...');
    var account = $('#account').prop('disabled', true).val();
    LPUtils.getJWT(account).then(function (jwt) {
      LPUtils.getDomain(account, 'asyncMessagingEnt').then(function (umsDomain) {
        LPWs.connect('wss://' + umsDomain + '/ws_api/account/' + account + '/messaging/consumer?v=3').then(function (openedSocket) {
          return handleOpenedSocket(openedSocket, jwt);
        }, function (errorOpening) {
          $('#log').append('error opening connection ' + errorOpening + '\n');
          prepareToConnect();
        });
      });
    }, function (errorGettingJwt) {
      $('#connect').text('connect');
      $('#account').prop('disabled', false).val();
      $('#log').append('error ' + errorGettingJwt + ' getting jwt for account ' + account + '\n');
    });
  });
}

function handleOpenedSocket(socket, jwt) {
  $('#log').html('connection is opened.\n');
  socket.registerRequests(apiRequestTypes);

  var me = myId(jwt);

  socket.initConnection({}, [{ "type": ".ams.headers.ConsumerAuthentication", "jwt": jwt }]);
  socket.onNotification(withType('MessagingEvent'), function (body) {
    return body.changes.forEach(function (change) {
      switch (change.event.type) {
        case 'ContentEvent':
          $('#log').append((change.originatorId === me ? 'you' : 'agent') + ': ' + change.event.message + '\n');
      }
    });
  });

  // subscribe to open conversations metadata
  socket.subscribeExConversations({
    'convState': ['OPEN']
  }).then(function (resp) {
    var openConvs = {};
    socket.onNotification(withSubscriptionID(resp.body.subscriptionId), function (notificationBody) {
      return handleConversationNotification(socket, notificationBody, openConvs);
    });

    $('#send').prop('disabled', false).click(function () {
      if (Object.keys(openConvs)[0]) {
        publishTo(socket, Object.keys(openConvs)[0]);
      } else {
        socket.consumerRequestConversation().then(function (resp) {
          return publishTo(socket, resp.body.conversationId);
        });
      }
    });
    $('#close').prop('disabled', false).click(function () {
      if (Object.keys(openConvs)[0]) {
        socket.updateConversationField({
          conversationId: Object.keys(openConvs)[0],
          conversationField: [{
            field: "ConversationStateField",
            conversationState: "CLOSE"
          }]
        });
      }
    });
  });

  $('#connect').text('disconnect').unbind('click').click(function () {
    return socket.ws.close();
  });
  socket.ws.onclose = function (evt) {
    return onCloseSocket(socket, evt);
  };
}

function handleConversationNotification(socket, notificationBody, openConvs) {
  notificationBody.changes.forEach(function (change) {
    if (change.type === 'UPSERT') {
      if (!openConvs[change.result.convId]) {
        openConvs[change.result.convId] = change.result;
        socket.subscribeMessagingEvents({
          fromSeq: 0,
          dialogId: change.result.convId
        });
      }
    } else if (change.type === 'DELETE') {
      delete openConvs[change.result.convId];
      $('#log').append('conversation was closed.\n');
    }
  });
}

function onCloseSocket(socket, evt) {
  socket.ws = null;
  $('#log').append('connection was closed with code ' + evt.code + '\n');
  prepareToConnect();
  $('#send').prop('disabled', true).unbind('click');
  $('#account').prop('disabled', false).val();
}

function publishTo(socket, convID) {
  socket.publishEvent({
    dialogId: convID,
    event: {
      type: 'ContentEvent',
      contentType: 'text/plain',
      message: $('#textline').val()
    }
  }).then(function (resp) {
    return $('#textline').val('');
  });
}

function withSubscriptionID(subscriptionID) {
  return function (notif) {
    return notif.body.subscriptionId === subscriptionID;
  };
}

function withType(type) {
  return function (notif) {
    return notif.type.includes(type);
  };
}

function myId(jwt) {
  return JSON.parse(atob(jwt.split('.')[1])).sub;
}

var apiRequestTypes = ['cqm.SubscribeExConversations', 'ms.PublishEvent', 'cm.ConsumerRequestConversation', 'ms.SubscribeMessagingEvents', 'InitConnection', 'cm.UpdateConversationField'];