import { ChannelType, PermissionsBitField } from 'discord.js'

const jsonExample = {
  roles: [
    {
      name: 'Admin',
      color: '#0000FF',
      permissions: [PermissionsBitField.Flags.Administrator.toString()] // Convert BigInt to string
    },
    {
      name: 'Moderator',
      color: '#FFA500',
      permissions: [
        PermissionsBitField.Flags.ManageMessages.toString(), // Convert BigInt to string
        PermissionsBitField.Flags.KickMembers.toString(), // Convert BigInt to string
        PermissionsBitField.Flags.ModerateMembers.toString(), // Convert BigInt to string
        PermissionsBitField.Flags.MoveMembers.toString() // Convert BigInt to string
      ]
    },
    {
      name: 'Member',
      color: '#008000',
      permissions: []
    }
  ],
  voiceChannels: [
    {
      name: 'General Voice',
      type: ChannelType.GuildVoice,
      permissions: []
    }
  ],
  textChannels: [
    {
      name: 'general',
      type: ChannelType.GuildText,
      topic: 'General chat',
      permissions: []
    },
    {
      name: 'announcements',
      type: ChannelType.GuildText,
      topic: 'Important announcements',
      messages: [
        {
          content:
            'Bem vindo ao servidor **GUILD_NAME**!\n\nPara começar, por favor, leia as regras no canal #{rules}.\nDivirta-se.\n\nCaso tenha alguma dúvida, entre em contato com um dos administradores.',
          pinMessage: true
        }
      ],
      permissions: [
        {
          role: 'Moderator',
          config: {
            ViewChannel: true,
            SendMessages: true,
            Connect: true,
            Speak: true
          }
        },
        {
          role: '@everyone',
          config: {
            ViewChannel: true,
            SendMessages: false,
            Connect: false,
            Speak: false
          }
        }
      ]
    },
    {
      name: 'rules',
      type: ChannelType.GuildText,
      topic: 'Rules of the server',
      permissions: [
        {
          role: 'Moderator',
          config: {
            ViewChannel: true,
            SendMessages: true,
            Connect: true,
            Speak: true
          }
        },
        {
          role: '@everyone',
          config: {
            ViewChannel: true,
            SendMessages: false,
            Connect: false,
            Speak: false
          }
        }
      ],
      messages: [
        {
          content:
            'Regras do servidor **GUILD_NAME**:\n\n1. Respeite todos os membros do servidor.\n2. Não faça spam.\n3. Não compartilhe informações pessoais.\n4. Não compartilhe conteúdo inapropriado.\n5. Não faça bullying.\n6. Não faça propaganda.\n7. Não utilize linguagem ofensiva.\n8. Não compartilhe links maliciosos.\n9. Não compartilhe conteúdo pirata.\n10. Não compartilhe conteúdo ilegal.',
          pinMessage: true
        }
      ]
    }
  ],
  categoryChannels: [
    {
      name: 'Admin Organization',
      type: ChannelType.GuildCategory,
      permissions: [
        {
          role: 'Moderator',
          config: {
            ViewChannel: true,
            SendMessages: true,
            Connect: true,
            Speak: true
          }
        },
        {
          role: '@everyone',
          config: {
            ViewChannel: false,
            SendMessages: false,
            Connect: false,
            Speak: false
          }
        }
      ],
      voiceChannels: [
        {
          name: 'Admin Voice 1',
          type: ChannelType.GuildVoice,
          permissions: []
        },
        {
          name: 'Admin Voice 2',
          type: ChannelType.GuildVoice,
          permissions: []
        },
        {
          name: 'Admin Voice 3',
          type: ChannelType.GuildVoice,
          permissions: []
        }
      ],
      textChannels: [
        {
          name: 'admin-channel',
          type: ChannelType.GuildText,
          topic: 'Admin chat',
          permissions: []
        }
      ]
    },
    {
      name: '5x5 Game organization',
      type: ChannelType.GuildCategory,
      permissions: [],
      voiceChannels: [
        {
          name: 'Team A',
          type: ChannelType.GuildVoice,
          userLimit: 5
        },
        {
          name: 'Team B',
          type: ChannelType.GuildVoice,
          userLimit: 5
        }
      ],
      textChannels: [
        {
          name: 'game-channel',
          type: ChannelType.GuildText,
          topic: 'Game chat'
        }
      ]
    },
    {
      name: 'Games Organization',
      type: ChannelType.GuildCategory,
      permissions: [],
      voiceChannels: [
        {
          name: 'Teste JSON 1',
          type: ChannelType.GuildVoice,
          userLimit: 5
        },
        {
          name: 'Teste JSON 2',
          type: ChannelType.GuildVoice,
          userLimit: 5
        },
        {
          name: 'Teste JSON 3',
          type: ChannelType.GuildVoice,
          userLimit: 5
        },
        {
          name: 'Teste JSON 4',
          type: ChannelType.GuildVoice,
          userLimit: 5
        },
        {
          name: 'Teste JSON 5',
          type: ChannelType.GuildVoice,
          userLimit: 5
        }
      ],
      textChannels: [
        {
          name: 'game-channel',
          type: ChannelType.GuildText,
          topic: 'Game chat'
        }
      ]
    },
    {
      name: 'AFK Organization',
      type: ChannelType.GuildCategory,
      permissions: [],
      voiceChannels: [
        {
          name: 'AFK Channel 🔇',
          type: ChannelType.GuildVoice,
          isAFK: true
        }
      ],
      textChannels: []
    }
  ]
}

console.log(JSON.stringify(jsonExample))
