import {
  FirstArgMissingError,
  MissingMemberError,
  MissingNewNameError
} from '../errors-handling/index.js'

export class AdminService {
  constructor(args) {
    this.args = args
    this.guild = null
  }
  async handle(command, message) {
    this.guild = message.guild
    const firstArg = this.args[0]
    console.log('firstArg', firstArg)
    // if (!firstArg) throw new FirstArgMissingError()
    let member
    if (firstArg && firstArg.startsWith('<@') && !firstArg.startsWith('<@&'))
      member = await this.getMember(message, firstArg)

    let response
    console.log(command)
    switch (command) {
      case 'ban':
        if (!firstArg.startsWith('<@') || !firstArg.endsWith('>'))
          throw new MissingMemberError()
        response = await this.banMember(message.guild, member)
        break
      case 'kick':
        if (!firstArg.startsWith('<@') || !firstArg.endsWith('>'))
          throw new MissingMemberError()
        response = await this.kickMember(message.guild, member)
        break
      case 'addPermission':
        const permission = this.args[0]
        response = await this.addPermissionToNewUser(member, permission)
        break
      case 'removePermission':
        const permissionToRemove = this.args[0]
        response = await this.removePermissionFromUser(
          member,
          permissionToRemove
        )
        break
      case 'setUserName':
        const newName = this.args[1]
        if (!newName) throw new MissingNewNameError()
        response = await this.setUserName(message.author, newName.trim())
        break
      case 'setNickName':
        const newNick = this.args[1]
        if (!newNick) throw new MissingNewNameError()
        response = await this.setNickName(member, newNick.trim())
        break
      case 'newUser':
        response = await this.addPermissionToNewUser(member ?? message?.member)
        break
      case 'setServerPermissions':
        response = await this.setServerPermissions(this.args)
        break
      case 'removeServerPermissions':
        response = this.removeSavedRoleFromServer(this.args)
        break
      case 'serverPermissions':
        response = this.getServerPermissions()
        break
      default:
        response = 'Comando não implementado'
        break
    }
    return response
  }

  getServerPermissions() {
    const savedRoles = this.guild?.settings
      ? this.guild.settings[`${this.guild.id}.roles`]
      : []
    if (!savedRoles.length) {
      return 'Nenhuma permissão salva para este servidor'
    }
    return `Permissões salvas para este servidor: ${savedRoles
      .map((role) => role)
      .join(', ')}`
  }

  async addPermissionToNewUser(member) {
    try {
      console.log('adicionando permissão ao usuário', member.user.username)
      const savedRoles =
        this.guild?.settings[`${this.guild.id}.roles`] ??
        member.guild?.settings[`${member.guild.id}.roles`]
      if (savedRoles) {
        savedRoles.forEach(async (role) => {
          await member.roles.add(role)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  removeSavedRoleFromServer(roles) {
    console.log('roles', JSON.stringify(roles))
    const guildId = this.guild.id
    const savedRoles = this.guild?.settings?.[`${guildId}.roles`] || []
    if (!savedRoles.length) {
      return 'nenhum cargo salvo para este servidor para ser removido'
    }

    const rolesIds = roles.map((role) => role.replace(/[^0-9]/g, ''))
    console.log('rolesIds', rolesIds)

    const updateServerRoles = savedRoles.filter(
      (role) => !rolesIds.includes(role.id)
    )

    console.log('updateServerRoles', JSON.stringify(updateServerRoles))
    this.guild.settings = {
      [`${guildId}.roles`]: updateServerRoles
    }

    return `Cargos ${roles} removidos como permissões para este servidor\nCargos salvos: ${updateServerRoles
      .map((role) => role)
      .join(', ')}
    `
  }

  async setServerPermissions(roles) {
    try {
      const guildRoles = await this.guild.roles.fetch()
      const numericRoleIds = roles
        .map((roleId) => roleId.replace(/[^0-9]/g, ''))
        .filter((roleId) => roleId != '')
      console.log('numericRoleIds', numericRoleIds)

      const serverRolesFiltered = guildRoles.filter((role) =>
        numericRoleIds.includes(role.id)
      )
      console.log('serverRolesFiltered', JSON.stringify(serverRolesFiltered))

      if (serverRolesFiltered.length === 0) {
        return 'Nenhum cargo valido encontrado'
      }
      const guildId = this.guild.id
      console.log('guildId', guildId)

      console.log('this.guild.settings', this.guild.settings)

      const existingServerRoles =
        this.guild?.settings?.[`${guildId}.roles`] || []

      const updateServerRoles = [...serverRolesFiltered, ...existingServerRoles]
        .flatMap((item) => item)
        .filter((role) => typeof role !== 'string')

      console.log('updateServerRoles', JSON.stringify(updateServerRoles))
      this.guild.settings = {
        [`${guildId}.roles`]: updateServerRoles
      }
      console.log('settings', JSON.stringify(this.guild.settings))
      return `Cargos ${updateServerRoles
        .map((role) => role)
        .join(', ')} salvos como permissões para este servidor`
    } catch (error) {
      console.log(error)
    }
  }

  async banMember(guild, member) {
    try {
      await member.ban({ reason: 'Banimento necessário' })
      const responseMessage = `Usuário ${member.user.globalName} banido com sucesso!`
      console.log(responseMessage)
      return responseMessage
    } catch (error) {
      console.error('Erro ao banir usuário:', error)
    }
  }

  async kickMember(guild, member) {
    try {
      await member.kick({ reason: 'Expulsão necessária' })
      const responseMessage = `Usuário ${member.user.globalName} expulso com sucesso!`
      console.log(responseMessage)
      return responseMessage
    } catch (error) {
      console.error('Erro ao expulsar usuário:', error)
    }
  }

  async addPermissionToUser(user, permission) {
    try {
      const guild = user.guild
      // Adiciona a permissão ao usuário no canal padrão da guilda
      await user.permissions.add(permission)
      console.log(
        `Permissão ${permission} adicionada ao usuário ${user.user.globalName} na guilda ${guild.name}`
      )
    } catch (error) {
      console.error('Erro ao adicionar permissão ao usuário:', error)
    }
  }

  async removePermissionFromUser(user, permission) {
    try {
      if (user instanceof discord.GuildMember) {
        const guild = user.guild
        await user.permissions.remove(permission)
        console.log(
          `Permissão ${permission} removida do usuário ${user.user.globalName} na guilda ${guild.name}`
        )
      } else if (user instanceof discord.User) {
        console.log(
          'O usuário não é um membro de guilda. Você precisa especificar a guilda para remover permissões.'
        )
      } else {
        console.log('Tipo de usuário não reconhecido.')
      }
    } catch (error) {
      console.error('Erro ao remover permissão do usuário:', error)
    }
  }

  async setUserName(user, newName) {
    try {
      await user.setUsername(newName)
      console.log(`Nome de usuário atualizado para ${newName}`)
    } catch (error) {
      console.error('Erro ao definir o nome de usuário:', error)
    }
  }

  async setNickName(member, newNick) {
    try {
      await member.setNickname(newNick)
      return `Apelido atualizado para ${newNick}`
    } catch (error) {
      console.error('Erro ao definir o apelido do usuário:', error)
    }
  }

  async getMember(message, memberId) {
    if (!/[<@!>]/g.test(memberId)) throw new MissingMemberError()

    const member = await message.guild.members.fetch(
      memberId.replace(/[<@!>]/g, '')
    )

    return member
  }
}
