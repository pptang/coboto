// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require('@slack/bolt');
const fetch = require('node-fetch');

const admin = require('firebase-admin');
const questions = require('./questions');

const questionBlocks = questions.flatMap((item) => [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: item.question,
      emoji: true,
    },
  },
  {
    block_id: `${item.key}_block`,
    type: 'actions',
    elements: [
      {
        type: 'radio_buttons',
        options: [
          {
            text: {
              type: 'plain_text',
              text: item.leftOption.text,
              emoji: true,
            },
            value: item.leftOption.value,
          },
          {
            text: {
              type: 'plain_text',
              text: item.rightOption.text,
              emoji: true,
            },
            value: item.rightOption.value,
          },
        ],
        action_id: item.key,
      },
    ],
  },
]);

admin.initializeApp({
  credential: admin.credential.cert(
    // TODO @paipo: fix local env variable configuration for testing
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  ),
});

// Check doc here: https://firebase.google.com/docs/firestore/query-data/get-data
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

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
      // Sample installation:
      /**
        * {
        *   team: { id: 'TBJ0K6T7G', name: 'Japan Insider' },
            enterprise: undefined,
            user: { token: undefined, scopes: undefined, id: 'UH3EZK20N' },
            tokenType: 'bot',
            isEnterpriseInstall: false,
            appId: 'A01NFRFTZC1',
            authVersion: 'v2',
            bot: {
              scopes: [Array],
              token: 'mock_token',
              userId: 'U01TBDEC048',
              id: 'B01SMRGUDS7'
            }
          }
       */
      const oauthRef = db.collection('oauth');
      return await oauthRef
        .doc(
          installation.isEnterpriseInstall
            ? installation.enterprise.id
            : installation.team.id
        )
        .set(installation);
    },
    fetchInstallation: async (installQuery) => {
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
        console.error('enterprise installation data:', doc.data());
        return doc.data();
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        const doc = await oauthRef.doc(installQuery.teamId).get();
        if (!doc.exists) {
          throw new Error(`${installQuery.teamId} doc doesn't exist in DB`);
        }
        return doc.data();
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
  } catch (error) {
    console.error(error);
  }
});

// Listen for a slash command invocation
app.command('/coboto', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();
  console.log({ questionBlocks });
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
          ...questionBlocks,
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

  const allAnswers = questions.map((item) => ({
    [item.key]:
      view['state']['values'][`${item.key}_block`][item.key]['selected_option'][
        'value'
      ],
  }));

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
          ...allAnswers,
        }),
      }
    );
    const data = await res.json();

    const imgUrl = data.imgUrl;
    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: channelId,
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
