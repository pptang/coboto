// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});



// All the room in the world for your code
app.event('app_home_opened', async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Welcome to your _App's Home_* :tada:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app."
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Click me!"
                }
              }
            ]
          }
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

// Listen for a slash command invocation
app.command('/pechakucha', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: payload.trigger_id,
      // View payload
      view: {
        "type": "modal",
        // View identifier
        callback_id: 'view_1',
        "title": {
          "type": "plain_text",
          "text": "Pecha Kucha",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Send",
          "emoji": true,
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "multiline": true,
              "action_id": "intro"
            },
            "label": {
              "type": "plain_text",
              "text": "🖋Tell your teammate about you!",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "interest"
            },
            "label": {
              "type": "plain_text",
              "text": "❣️Your interest: Favorite 📺Movie, 🎶Music, 🏂Sport, 🎮Game",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "social_media"
            },
            "label": {
              "type": "plain_text",
              "text": "🕹Social Media: Facebook, Instagram, witter, Note...etc.",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "fun_fact"
            },
            "label": {
              "type": "plain_text",
              "text": "😅Fun Fact",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "photo_url"
            },
            "label": {
              "type": "plain_text",
              "text": "📷Upload a photo to express your self",
              "emoji": true
            }
          }
        ]
      }
    });
    // console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.view('view_1', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  await ack();
  
  // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission

  // Assume there's an input block with `test_input` as the block_id and `dreamy_input` as the action_id
  const val = view['state']['values'];
  // const user = body['user']['id'];
  
  // You'll probably want to store these values somewhere
  console.log(val);
  // console.log(user);
  // Message the user
  try {
    await app.client.chat.postMessage({
      // Channel to send message to
      channel: payload.channel_id,
      text: val
    });
  }
  catch (error) {
    console.error(error);
  }
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
