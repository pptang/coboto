// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require('@slack/bolt');
const fetch = require('node-fetch');

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID || 'pecha-kucha-b5a45',
    privateKey:
      process.env.FIREBASE_PRIVATE_KEY ||
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRum9YZv5vfy4Q\nHGzosM2492q5pkjkvF8KFofFqazgsyVOlmP3hVC9giGEHku/g0Fd04RwEhjez5nw\nJwAwG+lPkRqYMMdFgKHWHDRXycOh3zHREkjA8h3QMvh5aF/wpGnPqDIuxo+yreEj\nPI01rK4YagxUaFMKfENVbYJewOVTaaTF06QPvpbyklxvYjKwTjQQHHS/ws1SejSL\nEdCEqj3+5v90pxbplm1oJSHL5PPrWigqB6X2EDH/5h17o/dejIbsERRtCQTZGSzI\n/HxMdOKA58se2Rn7HOOWMEDQ9H9yFzdubCCLEzTq6Wcktw3Jh6Whzd0jpiJ/ey7t\nFbLpujt9AgMBAAECggEAJF9CnbB4+lGyZaFkYuN8vhIMnIdB14dyrQ90uvs+69Yt\nx2gODLh+ZOtLUDwn014aSUEcVApTbVrQHeXJos5IY1/tHo1BFeTlzDnmev4XEzzf\nyRw0aV/j+z5HuNh44QVGg3iuQU320FxW8fM3oyIgLERCAKZ6FlSwIcHk7PVjoBgf\nCUblqHgBgjnq2i7NV3g3GxNv+GrkNVLRVSsDJwJmaNF8ajSaKgTnyG415Mm7aUbn\nb5w6Z991g9n5HX8gosHnLbclus2mLsQ8CZvPexZQugMJAU1e9FKLdyk3HQjm+s4t\nOcOlkTKHtccwn0BX3UBQuwSha65T5EZmagOH2/6f6QKBgQDwuteqnEEzDf+eWcok\npCUX5tnV9FB5S2tYOBFKk+a5UQBFYYRxxiURxq6RiH46SoQwkxlOgqyaigPe6Lp0\nIseDVMk5+5cn4sY9MC5ooBdvnJGtcQ18OpViT1TM+6kS11nVynvO8neDoFLwreUW\nybZsRU0VpPy+v6NZ58A7vSbBRQKBgQDfCConw1sE9gZzgXlSEaTTcp/8b2I1qR81\nm+MPe00HKRM5F+1IkYgwtaw6/9rrxBy84BQ7X15P9RCSLtVZ0JViHAR1KQoBk5ks\n2pso5g8JTeCHrfp1wEUzHVG65sRh5TSiDd8AcNLD7bI4T55GlcVpJjwsUjvGoGkB\nTIhpX0FI2QKBgHAjiY2HZnPjBH1+dETnVgQxXK5nNgma0XFyBNQJ28Pd8NNhHvJl\nDCWguPdAbxS2W6fJDlPdWYxP2IfBQAITpX8PQwHIqlxBLnmYdTX1xZUPiWkTLeX9\n4FLAg89NODB3svh9b3kyx+vABoLpbrtT0a/UBJmdlsNAwFaEN69caK5FAoGALqZ6\nis6l3yfGuao/QhdGrqOvKxHxLOAvEvuERty3g+PnjW2fyCoInoehesXBeMcQa8FC\n+hg8leTgjnMVVS/3zwmlNQxcd2/z/hnLkoZsZrnPWRHe7XpF/ycGzV0vfnp+w9a6\n6lCvBSRWvsiIhqMVI6VHuM2Ki0VKMWdcsQ2njiECgYEAmDl60WbU4FPNeee6FphH\n39biFZQheIq2zE/dtRsgdaBdDmLst9Agb8GzjRCULyPtdVE3MDHrlHWQ30MdA7kp\nQG++pLAEtoxnSYoj+nVCZCiE0C5mFv+rOko/2X5sElkOIFUZ7OFxwttB7d3G6kEP\n0uXJffoT/RZGVJ84auO5lok=\n-----END PRIVATE KEY-----\n',
    clientEmail:
      process.env.FIREBASE_CLIENT_EMAIL ||
      'firebase-adminsdk-fvuxc@pecha-kucha-b5a45.iam.gserviceaccount.com',
  }),
});

// Check doc here: https://firebase.google.com/docs/firestore/query-data/get-data
const db = admin.firestore();

const app = new App({
  // token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // For OAuth
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'coboto-state-secret',
  scopes: ['chat:write', 'commands'],
  installationStore: {
    storeInstallation: async (installation) => {
      console.log('storeInstallation:', { installation });
      const oauthRef = db.collection('oauth');
      return await oauthRef
        .doc(
          installation.isEnterpriseInstall
            ? installation.enterprise.id
            : installation.team.id
        )
        .set({ installation });
    },
    fetchInstallation: async (installQuery) => {
      console.log('fetchInstallation:', { installQuery });
      // change the line below so it fetches from your database
      const oauthRef = db.collection('oauth');
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        // org wide app installation lookup
        const doc = await oauthRef.doc(installQuery.enterpriseId).get();
        if (!doc.exists) {
          throw new Error(
            `${installQuery.enterprisedId} doc doesn't exist in DB`
          );
        }
        console.log('enterprise installation data:', doc.data());
        return doc.data().installation;
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        const doc = await oauthRef.doc(installQuery.teamId).get();
        if (!doc.exists) {
          throw new Error(`${installQuery.teamId} doc doesn't exist in DB`);
        }
        console.log('team installation data:', doc.data());
        return doc.data().installation;
      }
      throw new Error('Failed fetching installation');
    },
  },
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
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*COBOTO* :tada:',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                'More than an icebreaker, COBOTO creates engagement in a group setting and improves team dynamics in a very interesting way. Empower personal characters, COBOTO visualizes things in common of group or people that ultimately offers great opportunities to a deeper relationship as well as a successful team collaboration.',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Key Features of ROBOTO!*',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '- Super simple',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '- Break the ice with comfort',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '- Make new hires feel welcome',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '- Cultivate openness culture',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '- Meaningful conversation',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '- Drives teammates engagement',
            },
          },
        ],
      },
    });
    console.log(result);
  } catch (error) {
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
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'COBOTO',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                'Hello, create your *COBOTO* graph by answering questions as below:',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Drink at work?',
              emoji: true,
            },
          },
          {
            block_id: 'drink_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '☕️',
                      emoji: true,
                    },
                    value: 'coffee',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🍵',
                      emoji: true,
                    },
                    value: 'tea',
                  },
                ],
                action_id: 'drink',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Drink after work?',
              emoji: true,
            },
          },
          {
            block_id: 'alcohol_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🍷',
                      emoji: true,
                    },
                    value: 'wine',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🍺',
                      emoji: true,
                    },
                    value: 'beer',
                  },
                ],
                action_id: 'alcohol',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Your winter choice?',
              emoji: true,
            },
          },
          {
            block_id: 'winter_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '⛷',
                      emoji: true,
                    },
                    value: 'ski',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🏂',
                      emoji: true,
                    },
                    value: 'snowboard',
                  },
                ],
                action_id: 'winter',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Your manager is?',
              emoji: true,
            },
          },
          {
            block_id: 'manager_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🦁',
                      emoji: true,
                    },
                    value: 'lion',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🐑',
                      emoji: true,
                    },
                    value: 'sheep',
                  },
                ],
                action_id: 'manager',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Communication style?',
              emoji: true,
            },
          },
          {
            block_id: 'communication_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🐶',
                      emoji: true,
                    },
                    value: 'dog',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '😸',
                      emoji: true,
                    },
                    value: 'cat',
                  },
                ],
                action_id: 'communication',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Working style?',
              emoji: true,
            },
          },
          {
            block_id: 'working_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🏹',
                      emoji: true,
                    },
                    value: 'arrow',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '👩‍🌾',
                      emoji: true,
                    },
                    value: 'farmer',
                  },
                ],
                action_id: 'working',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Your favorite lunch?',
              emoji: true,
            },
          },
          {
            block_id: 'food_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🍔',
                      emoji: true,
                    },
                    value: 'burger',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🍣',
                      emoji: true,
                    },
                    value: 'sushi',
                  },
                ],
                action_id: 'food',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Have fun on holiday?',
              emoji: true,
            },
          },
          {
            block_id: 'place_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '⛰',
                      emoji: true,
                    },
                    value: 'mountain',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🌊',
                      emoji: true,
                    },
                    value: 'sea',
                  },
                ],
                action_id: 'place',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Energy hours?',
              emoji: true,
            },
          },
          {
            block_id: 'energy_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🌞',
                      emoji: true,
                    },
                    value: 'day',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🧛‍♀️',
                      emoji: true,
                    },
                    value: 'night',
                  },
                ],
                action_id: 'energy',
              },
            ],
          },
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Your favorite lunch?',
              emoji: true,
            },
          },
          {
            block_id: 'exercise_block',
            type: 'actions',
            elements: [
              {
                type: 'radio_buttons',
                options: [
                  {
                    text: {
                      type: 'plain_text',
                      text: '🏋️‍♂️',
                      emoji: true,
                    },
                    value: 'gym',
                  },
                  {
                    text: {
                      type: 'plain_text',
                      text: '🏃‍♀️',
                      emoji: true,
                    },
                    value: 'running',
                  },
                ],
                action_id: 'exercise',
              },
            ],
          },
          {
            block_id: 'channel_block',
            type: 'input',
            optional: true,
            label: {
              type: 'plain_text',
              text: 'Select a channel to post the result on',
            },
            element: {
              action_id: 'channel',
              type: 'conversations_select',
              default_to_current_conversation: true,
              response_url_enabled: true,
            },
          },
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit',
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.view('view_1', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();

  const channelId =
    view['state']['values']['channel_block']['channel'][
      'selected_conversation'
    ];

  const drink =
    view['state']['values']['drink_block']['drink']['selected_option']['value'];
  const alcohol =
    view['state']['values']['alcohol_block']['alcohol']['selected_option'][
      'value'
    ];
  const winter =
    view['state']['values']['winter_block']['winter']['selected_option'][
      'value'
    ];
  const manager =
    view['state']['values']['manager_block']['manager']['selected_option'][
      'value'
    ];
  const communication =
    view['state']['values']['communication_block']['communication'][
      'selected_option'
    ]['value'];
  const working =
    view['state']['values']['working_block']['working']['selected_option'][
      'value'
    ];
  const food =
    view['state']['values']['food_block']['food']['selected_option']['value'];
  const place =
    view['state']['values']['place_block']['place']['selected_option']['value'];
  const energy =
    view['state']['values']['energy_block']['energy']['selected_option'][
      'value'
    ];
  const exercise =
    view['state']['values']['exercise_block']['exercise']['selected_option'][
      'value'
    ];

  // Message the user
  try {
    const res = await fetch(
      'https://pecha-kucha-mashi-mashi.herokuapp.com/generate-preference-chart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          drink,
          alcohol,
          winter,
          manager,
          communication,
          working,
          food,
          place,
          energy,
          exercise,
        }),
      }
    );
    console.log({ channelId });
    const data = await res.json();

    const imgUrl = data.imgUrl;
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: channelId,
      // text: '*Coffee or Tea:* ' + selectOption + '\n\n' + '*Introduction:* ' + intro + '\n\n' + '*Interest:* ' + interest + '\n\n' + '*Fun Fact:* ' + funFact + '\n\n' + '*Social Media:* ' + socialMedia + '\n\n',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "COBOTO! Let's know your group members 👀",
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'image',
          image_url: imgUrl,
          alt_text: 'inspiration',
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
