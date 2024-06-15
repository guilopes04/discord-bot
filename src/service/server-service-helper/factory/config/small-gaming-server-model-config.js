import { ChannelType, PermissionsBitField } from 'discord.js'

export const smallGamingServerModelConfig = {
  roles: [
    {
      name: 'Admin',
      color: '#0000FF',
      permissions: [PermissionsBitField.Flags.Administrator]
    },
    {
      name: 'Moderator',
      color: '#FFA500',
      permissions: [
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.KickMembers,
        PermissionsBitField.Flags.ModerateMembers,
        PermissionsBitField.Flags.MoveMembers
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
          name: 'Admin Voice',
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
      name: 'Game Organization',
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
