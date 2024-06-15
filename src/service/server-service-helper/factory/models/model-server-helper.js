export class ModelServerHelper {
  constructor(guild) {
    this.guild = guild
  }
  async handleServerSchema(serverModelConfig) {
    const [roles, voiceChannels, textChannels, categoryChannels] =
      await Promise.all([
        this.createRoles(serverModelConfig.roles),
        this.createVoiceChannels(serverModelConfig.voiceChannels),
        this.createTextChannels(serverModelConfig.textChannels),
        this.createCategoryChannels(serverModelConfig.categoryChannels)
      ])

    await Promise.all([
      this.handleCategoryChannels(categoryChannels),
      this.handleChannelsPermissions({
        roles,
        voiceChannels,
        textChannels,
        categoryChannels
      })
    ])
  }

  async createRoles(roles) {
    if (!roles?.length) return []
    const rolesCreated = await Promise.all(
      roles.map(async (role) => {
        return { label: role.name, role: await this.guild.roles.create(role) }
      })
    )

    return rolesCreated
  }

  async createVoiceChannels(voiceChannels) {
    if (!voiceChannels?.length) return []
    const voiceChannelCreated = await Promise.all(
      voiceChannels.map(async (voiceChannel) => {
        return {
          label: voiceChannel.name,
          channel: await this.guild.channels.create({
            name: voiceChannel.name,
            type: voiceChannel.type,
            userLimit: voiceChannel?.userLimit
          }),
          permissions: voiceChannel?.permissions,
          isAFK: voiceChannel?.isAFK
        }
      })
    )

    voiceChannelCreated.map((voiceChannel) => {
      if (voiceChannel.isAFK) {
        this.configureVoiceChannelAsAfk(voiceChannel.channel)
      }
    })
    return voiceChannelCreated
  }

  async createTextChannels(textChannels) {
    if (!textChannels?.length) return []
    const textChannelsCreated = await Promise.all(
      textChannels.map(async (textChannel) => {
        return {
          label: textChannel.name,
          channel: await this.guild.channels.create({
            name: textChannel.name,
            type: textChannel.type,
            topic: textChannel?.topic
          }),
          permissions: textChannel?.permissions,
          messages: textChannel?.messages
        }
      })
    )
    await Promise.all(
      textChannelsCreated.map(async (channel) => {
        if (!channel.messages) return
        await Promise.all(
          channel.messages.map((message) => {
            let replacedContent = message.content.replace(
              'GUILD_NAME',
              this.guild.name
            )
            const regex = /#{(.*?)}/g
            const matches = message.content.match(regex)
            if (matches?.length) {
              const channels = matches.map((match) => {
                const channelName = match.replace('#{', '').replace('}', '')
                return textChannelsCreated.find(
                  (channel) => channel.label === channelName
                )
              })
              console.log('matches', matches)

              for (let i = 0; i < matches.length; i++) {
                const match = matches[i]
                const channel = channels[i]
                replacedContent = replacedContent.replace(
                  match,
                  `<#${channel.channel.id}>`
                )
              }
            }

            return channel.channel
              .send(replacedContent)
              .then((messageInChat) => {
                if (!message.pinMessage) return
                messageInChat.pin()
              })
          })
        )
      })
    )

    return textChannelsCreated
  }

  async createCategoryChannels(categoryChannels) {
    if (!categoryChannels?.length) return []
    const categoryChannelsCreated = await Promise.all(
      categoryChannels.map(async (categoryChannel) => {
        return {
          label: categoryChannel.name,
          channel: await this.guild.channels.create({
            name: categoryChannel.name,
            type: categoryChannel.type
          }),
          permissions: categoryChannel?.permissions,
          channels: {
            textChannels: categoryChannel?.textChannels.length
              ? await this.createTextChannels(categoryChannel?.textChannels)
              : [],
            voiceChannels: categoryChannel?.voiceChannels.length
              ? await this.createVoiceChannels(categoryChannel?.voiceChannels)
              : []
          }
        }
      })
    )

    return categoryChannelsCreated
  }

  setChannelPermissions({ channel, role, permissions }) {
    return channel.permissionOverwrites.create(role, permissions)
  }

  async handleCategoryChannels(categoryChannels) {
    if (!categoryChannels?.length) return
    await Promise.all(
      categoryChannels.map(async (categoryChannel) => {
        const { textChannels, voiceChannels } = categoryChannel.channels
        const channelsToSetParent = [...textChannels, ...voiceChannels]

        if (channelsToSetParent.length) {
          await Promise.all(
            channelsToSetParent.map((channelCreated) => {
              channelCreated.channel.setParent(categoryChannel.channel)
            })
          )
        }
      })
    )
  }

  async handleChannelsPermissions({
    roles,
    voiceChannels,
    textChannels,
    categoryChannels
  }) {
    const chatChannelsToSetPermissions = [
      ...(textChannels || []),
      ...(voiceChannels || []),
      ...(categoryChannels || []),
      ...(categoryChannels.channels?.textChannels || []),
      ...(categoryChannels.channels?.voiceChannels || [])
    ].filter((channel) => channel !== undefined)

    await Promise.all(
      chatChannelsToSetPermissions.map(async (channel) => {
        const permissions = channel?.permissions
        if (!permissions.length) return
        permissions.map((permission) => {
          const role = this.getRole(roles, permission.role)
          if (!role) return
          return this.setChannelPermissions({
            channel: channel.channel,
            role: role,
            permissions: permission.config
          })
        })
      })
    )
  }

  getRole(roles, roleName) {
    return roleName === '@everyone'
      ? this.guild.roles.everyone
      : roles.find((role) => role.label === roleName).role
  }

  configureVoiceChannelAsAfk({ id }) {
    this.guild
      .setAFKChannel(id)
      .then((guild) => {
        return guild.setAFKTimeout(900)
      })
      .catch((error) => {
        console.error('Erro ao configurar o canal AFK:', error)
      })
  }
}
