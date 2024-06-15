import { ChannelType, PermissionsBitField } from 'discord.js'
import { createServerServiceHelper } from './server-service-helper/index.js'

export class ServerService {
  constructor(args) {
    this.args = args
    this.guild = null
    this.message = null
  }

  async handle(command, message) {
    this.guild = message.guild
    this.message = message

    switch (command) {
      case 'setupServer':
        return await this.setupServer(this.args[0])
      case 'clearServer':
        return await this.clearServer()
      default:
        return 'Comando não implementado'
    }
  }

  async setupServer(serverModel) {
    try {
      console.time('Server setup')
      let serverStructure = null
      if (this.message.attachments.size > 0) {
        serverStructure = await this.validateAndHandleAttachment()
      }
      await this.clearServer()
      const serverModelService = createServerServiceHelper(
        this.guild,
        serverModel,
        serverStructure
      )

      await serverModelService.handle()

      console.timeEnd('Server setup')
      return 'Server setup completed successfully'
    } catch (error) {
      console.error('Error setting up server:', error)
      return 'Error setting up server'
    }
  }

  async clearServer() {
    try {
      // Delete all text channels

      const textChannels = this.guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildText
      )
      await Promise.all(textChannels.map((channel) => channel.delete()))

      // Delete all voice channels
      const voiceChannels = this.guild.channels.cache
      await Promise.all(voiceChannels.map((channel) => channel.delete()))

      // Delete all roles
      const roles = this.guild.roles.cache.filter(
        (role) => role.name !== '@everyone' && !role.managed
      )
      await Promise.all(roles.map((role) => role.delete()))

      //return 'Server cleared successfully'
    } catch (error) {
      console.error('Error clearing server:', error)
      return 'Error clearing server'
    }
  }

  async validateAndHandleAttachment() {
    for (const attachment of this.message.attachments.values()) {
      if (attachment.name.endsWith('.json')) {
        try {
          console.log(`Attachment URL: ${attachment.url}`)

          const response = await fetch(attachment.url)
          const jsonText = await response.text()

          const jsonData = JSON.parse(jsonText)
          console.log('JSON data:', JSON.stringify(jsonData))

          if (
            Array.isArray(jsonData.roles) &&
            Array.isArray(jsonData.voiceChannels) &&
            Array.isArray(jsonData.textChannels) &&
            Array.isArray(jsonData.categoryChannels)
          ) {
            console.log('JSON data contains the required properties.')
            const { roles } = jsonData
            const permissionsBitField = []
            roles.map((role) => {
              if (role.permissions) {
                console.log('role', role)
                role.permissions.map((permission) => {
                  console.log('permission', permission)
                  const permissionBitGlag =
                    this.mappingPermissionsBitField(permission)
                  console.log('permissionBitGlag', permissionBitGlag)
                  permissionsBitField.push(permissionBitGlag)
                })
                role.permissions = permissionsBitField
              }
            })

            return jsonData
          } else {
            console.log('JSON data does not contain the required properties.')
            return 'O arquivo json informado, não está no modelo esperado.'
          }
        } catch (error) {
          console.error(`Failed to process attachment: ${error}`)
        }
      }
    }
  }

  mappingPermissionsBitField(permissionToString) {
    const permissionsBitFieldKeys = Object.keys(PermissionsBitField.Flags)
    const permissionsBitField = permissionsBitFieldKeys.map((key) => {
      return PermissionsBitField.Flags[key]
    })
    const permissionsBitFieldToString = permissionsBitField.map(
      (permission) => {
        return {
          bitFieldString: permission.toString(),
          bitField: permission
        }
      }
    )

    for (const permission of permissionsBitFieldToString) {
      if (permission.bitFieldString === permissionToString) {
        return permission.bitField
      }
    }
  }
}
