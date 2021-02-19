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
              "text": "*COBOTO* :tada:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "More than an icebreaker, COBOTO creates engagement in a group setting and improves team dynamics in a very interesting way. Empower personal characters, COBOTO visualizes things in common of group or people that ultimately offers great opportunities to a deeper relationship as well as a successful team collaboration."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Key Features of ROBOTO!*"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "- Super simple"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "- Break the ice with comfort"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "- Make new hires feel welcome"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "- Cultivate openness culture"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "- Meaningful conversation"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "- Drives teammates engagement"
            }
          }
        ]
      }
    });
    console.log(result)
  }
  catch (error) {
    console.error(error);
  }
});


// Listen for a slash command invocation
app.command('/coboto', async ({ ack, payload, context }) => {
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
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Drink at work?",
              "emoji": true
            }
          },
          {
            "block_id": "drink_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "☕️",
                      "emoji": true
                    },
                    "value": "coffee"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🍵",
                      "emoji": true
                    },
                    "value": "tea"
                  }
                ],
                "action_id": "drink"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Drink after work?",
              "emoji": true
            }
          },
          {
            "block_id": "alcohol_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🍷",
                      "emoji": true
                    },
                    "value": "wine"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🥃",
                      "emoji": true
                    },
                    "value": "whisky"
                  }
                ],
                "action_id": "alcohol"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Your winter choice?",
              "emoji": true
            }
          },
          {
            "block_id": "winter_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "⛷",
                      "emoji": true
                    },
                    "value": "ski"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🏂",
                      "emoji": true
                    },
                    "value": "snowboard"
                  }
                ],
                "action_id": "winter"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Your manager is?",
              "emoji": true
            }
          },
          {
            "block_id": "manager_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🦁",
                      "emoji": true
                    },
                    "value": "lion"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🐑",
                      "emoji": true
                    },
                    "value": "sheep"
                  }
                ],
                "action_id": "manager"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Communication style?",
              "emoji": true
            }
          },
          {
            "block_id": "communication_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🐶",
                      "emoji": true
                    },
                    "value": "dog"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "😸",
                      "emoji": true
                    },
                    "value": "cat"
                  }
                ],
                "action_id": "communication"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Working style?",
              "emoji": true
            }
          },
          {
            "block_id": "place_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🏹",
                      "emoji": true
                    },
                    "value": "arrow"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "👩‍🌾",
                      "emoji": true
                    },
                    "value": "farmer"
                  }
                ],
                "action_id": "working"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Your favorite lunch?",
              "emoji": true
            }
          },
          {
            "block_id": "food_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🍔",
                      "emoji": true
                    },
                    "value": "burger"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🍣",
                      "emoji": true
                    },
                    "value": "sushi"
                  }
                ],
                "action_id": "food"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Have fun on holiday?",
              "emoji": true
            }
          },
          {
            "block_id": "place_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "⛰",
                      "emoji": true
                    },
                    "value": "mountain"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🌊",
                      "emoji": true
                    },
                    "value": "sea"
                  }
                ],
                "action_id": "place"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Energy hours?",
              "emoji": true
            }
          },
          {
            "block_id": "energy_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "☀️",
                      "emoji": true
                    },
                    "value": "day"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🧛‍♀️",
                      "emoji": true
                    },
                    "value": "night"
                  }
                ],
                "action_id": "energy"
              }
            ]
          },
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Your favorite lunch?",
              "emoji": true
            }
          },
          {
            "block_id": "exercise_block",
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🏋️‍♂️",
                      "emoji": true
                    },
                    "value": "gym"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "🏃‍♀️",
                      "emoji": true
                    },
                    "value": "running"
                  }
                ],
                "action_id": "exercise"
              }
            ]
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
  console.log(view['state']['values'])
  const channel_id = view['state']['values']['channel_block']['channel']['selected_conversation'];
  
  const ball = view['state']['values']['ball_block']['ball']['selected_option']['value'];
  const alcohol = view['state']['values']['alcohol_block']['alcohol']['selected_option']['value'];
  const sports = view['state']['values']['sports_block']['sports']['selected_option']['value'];
  const place = view['state']['values']['place_block']['place']['selected_option']['value'];
  const food = view['state']['values']['food_block']['food']['selected_option']['value'];
  const entertainment = view['state']['values']['entertainment_block']['entertainment']['selected_option']['value'];
  const drink = view['state']['values']['drink_block']['drink']['selected_option']['value'];
  console.log({ball, alcohol, sports,place, food, entertainment, drink})
  // Message the user
  try {
    const res = await fetch('https://pecha-kucha-mashi-mashi.herokuapp.com/generate-preference-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ball, alcohol, sports, place, food, entertainment, drink,
      })
    })

    const data = await res.json();
    
    const imgUrl = data.imgUrl;
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: channel_id,
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
        {
          "type": "image",
          "image_url": imgUrl,
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
