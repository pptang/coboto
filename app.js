// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const fetch = require('node-fetch');

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
        // View identifier
        "callback_id": 'view_1',
        "type": "modal",
        "title": {
          "type": "plain_text",
          "text": "Ikigai",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Hello, create your *Ikigai* graph by answering questions as below:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*DO WHAT YOU LOVE*"
            }
          },
          {
            "type": "divider"
          },
          {
            "block_id": "love_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "love"
            },
            "label": {
              "type": "plain_text",
              "text": "What did you love doing or thinking about when you were a child?",
              "emoji": true
            }
          },
          {
            "block_id": "happy_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "happy"
            },
            "label": {
              "type": "plain_text",
              "text": "What activities do you do in your spare time that make you happy?",
              "emoji": true
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*DO WHAT YOU'RE GOOD AT*"
            }
          },
          {
            "type": "divider"
          },
          {
            "block_id": "skill_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "skill"
            },
            "label": {
              "type": "plain_text",
              "text": "What are your skills and strengths",
              "emoji": true
            }
          },
          {
            "block_id": "help_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "help"
            },
            "label": {
              "type": "plain_text",
              "text": "What do people ask you help for?",
              "emoji": true
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*DO SOMETHING THE WORLD NEEDS*"
            }
          },
          {
            "type": "divider"
          },
          {
            "block_id": "inspire_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "inspire"
            },
            "label": {
              "type": "plain_text",
              "text": "What/Who inspires you?",
              "emoji": true
            }
          },
          {
            "block_id": "angry_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "angry"
            },
            "label": {
              "type": "plain_text",
              "text": "What makes you angry / frustrated?",
              "emoji": true
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*DO SOMETHING YOU CAN BE PAID FOR*"
            }
          },
          {
            "type": "divider"
          },
          {
            "block_id": "sell_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "sell"
            },
            "label": {
              "type": "plain_text",
              "text": "What product/service could you sell?",
              "emoji": true
            }
          },
          {
            "block_id": "job_block",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "job"
            },
            "label": {
              "type": "plain_text",
              "text": "What job could you do?",
              "emoji": true
            }
          },
          {
            "block_id": "channel_block",
            "type": "input",
            "optional": true,
            "label": {
              "type": "plain_text",
              "text": "Select a channel to post the result on",
            },
            "element": {
              "action_id": "channel",
              "type": "conversations_select",
              "default_to_current_conversation": true,
              "response_url_enabled": true,
            },
          },
        ]
      }
//       view: {
//         "type": "modal",
//         // View identifier
//         callback_id: 'view_1',
//         "title": {
//           "type": "plain_text",
//           "text": "Pecha Kucha",
//           "emoji": true
//         },
//         "submit": {
//           "type": "plain_text",
//           "text": "Send",
//           "emoji": true,
//         },
//         "close": {
//           "type": "plain_text",
//           "text": "Cancel",
//           "emoji": true
//         },
//         "blocks": [
//           {
//             "block_id": "select_block",          
//             "type": "section",
//             "text": {
//               "type": "mrkdwn",
//               "text": "*Coffee or Tea*"
//             },
//             "accessory": {
//               "type": "radio_buttons",
//               "options": [
//                 {
//                   "text": {
//                     "type": "plain_text",
//                     "text": "Coffee",
//                     "emoji": true
//                   },
//                   "value": "Coffee"
//                 },
//                 {
//                   "text": {
//                     "type": "plain_text",
//                     "text": "Tea",
//                     "emoji": true
//                   },
//                   "value": "Tea"
//                 },
//               ],
//               "action_id": "radio_buttons-action"
//             }
          
              
//           },
//           {
//             "block_id": "intro_block",
//             "type": "input",
//             "element": {
//               "type": "plain_text_input",
//               "multiline": true,
//               "action_id": "intro"
//             },
//             "label": {
//               "type": "plain_text",
//               "text": "🖋Tell your teammate about you!",
//               "emoji": true
//             }
//           },
//           {
//             "block_id": "interest_block",
//             "type": "input",
//             "element": {
//               "type": "plain_text_input",
//               "action_id": "interest"
//             },
//             "label": {
//               "type": "plain_text",
//               "text": "❣️Your interest: Favorite 📺Movie, 🎶Music, 🏂Sport, 🎮Game",
//               "emoji": true
//             }
//           },
//           {
//             "block_id": "socialMedia_block",
//             "type": "input",
//             "element": {
//               "type": "plain_text_input",
//               "action_id": "social_media"
//             },
//             "label": {
//               "type": "plain_text",
//               "text": "🕹Social Media: Facebook, Instagram, witter, Note...etc.",
//               "emoji": true
//             }
//           },
//           {
//             "block_id": "funFact_block",
//             "type": "input",
//             "element": {
//               "type": "plain_text_input",
//               "action_id": "fun_fact"
//             },
//             "label": {
//               "type": "plain_text",
//               "text": "😅Fun Fact",
//               "emoji": true
//             }
//           },
//           {
//             "block_id": "photoUrl_block",
//             "type": "input",
//             "element": {
//               "type": "plain_text_input",
//               "action_id": "photo_url"
//             },
//             "label": {
//               "type": "plain_text",
//               "text": "📷Upload a photo to express your self",
//               "emoji": true
//             }
//           },
//           {
//             "block_id": "my_block_id",
//             "type": "input",
//             "optional": true,
//             "label": {
//               "type": "plain_text",
//               "text": "Select a channel to post the result on",
//             },
//             "element": {
//               "action_id": "my_action_id",
//               "type": "conversations_select",
//               "default_to_current_conversation": true,
//               "response_url_enabled": true,
//             },
//           },
//         ]
//       }
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.view('view_1', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();
  
  // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission

  // Assume there's an input block with `test_input` as the block_id and `dreamy_input` as the action_id
  // console.log('test')
  // const channel_id = view['state']['values']['channel']['selected_conversation'];
  
  // const intro = view['state']['values']['intro_block']['intro']['value'];
  // const funFact = view['state']['values']['funFact_block']['fun_fact']['value'];
  // const interest = view['state']['values']['interest_block']['interest']['value'];
  // const socialMedia = view['state']['values']['socialMedia_block']['social_media']['value'];
  // const selectOption = view['state']['values']['select_block']['radio_buttons-action']['selected_option']['value'];
  // const photoUrl = view['state']['values']['photoUrl_block']['photo_url']['value'];
  const love = view['state']['values']['love_block']['love']['value'];
  const happy = view['state']['values']['happy_block']['happy']['value'];
  const skill = view['state']['values']['skill_block']['skill']['value'];
  const help = view['state']['values']['help_block']['help']['value'];
  const inspire = view['state']['values']['inspire_block']['inspire']['value'];
  const angry = view['state']['values']['angry_block']['angry']['value'];
  const sell = view['state']['values']['sell_block']['sell']['value'];
  const job = view['state']['values']['job_block']['job']['value'];
  const channel = view['state']['values']['channel_block']['channel']['selected_conversation'];
  
  
  // Message the user
  try {
    const res = await fetch('https://pecha-kucha-mashi-mashi.herokuapp.com/generate-ikigai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        love,
        happy,
        skill,
        help,
        inspire,
      })
    })

    const data = await res.json();
    
    const path = data.imgUrl.split('/')[3]
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      // channel: channel_id,
      // text: '*Coffee or Tea:* ' + selectOption + '\n\n' + '*Introduction:* ' + intro + '\n\n' + '*Interest:* ' + interest + '\n\n' + '*Fun Fact:* ' + funFact + '\n\n' + '*Social Media:* ' + socialMedia + '\n\n',
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Hello, Check this out 👀"
          }
        },
        {
          "type": "divider"
        },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": "*Coffee or Tea:* " + selectOption
        //   }
        // },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": "*Introduction:* " + intro
        //   }
        // },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": "*Interest:* " + interest
        //   }
        // },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": "*Fun Fact:* " + funFact
        //   }
        // },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": "*Social Media:* " + socialMedia
        //   }
        // },
        // {
        //   "type": "section",
        //   "text": {
        //     "type": "mrkdwn",
        //     "text": "*A photo of me:* "
        //   }
        // },
        {
          "type": "image",
          "image_url": 'https://pecha-kucha-mashi-mashi.herokuapp.com/' + path,
          // "image_url": "https://i1.wp.com/thetempest.co/wp-content/uploads/2017/08/The-wise-words-of-Michael-Scott-Imgur-2.jpg?w=1024&ssl=1",
          "alt_text": "inspiration"
        }
      ]
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
