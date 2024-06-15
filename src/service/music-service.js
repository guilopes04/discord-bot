import {
  joinVoiceChannel,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus
} from '@discordjs/voice'
import { EmbedBuilder } from 'discord.js'

import SpotifyWebApi from 'spotify-web-api-node'
import spotifyUrlInfo from 'spotify-url-info'
import soundCloud from 'soundcloud-downloader'
import ytdl from 'ytdl-core'

// Spotify API credentials
const spotifyApi = new SpotifyWebApi({
  clientId: 'YOUR_SPOTIFY_CLIENT_ID',
  clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET'
})

export class MusicService {
  constructor(args, serverQueue) {
    this.queue = serverQueue
    this.args = args
    this.player = createAudioPlayer()
    this.connection = null
  }

  async handle(command, message) {
    console.log(
      'message.member.voice.channel.id',
      message.member.voice.channel.id
    )
    this.connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    })
    let response
    switch (command) {
      case 'play':
        console.log(
          `this.queue.get(${message.guild.id}): `,
          this.queue.get(message.guild.id)
        )
        if (!this.queue.get(message.guild.id)) {
          await this.addToQueue(this.args[0], message)
          response = await this.playNextSong(message)
        } else {
          await this.addToQueue(this.args[0], message)
        }
        break
      case 'stop':
        response = this.stopSong(message)
        break
      case 'unpause':
        response = this.unpauseSong()
        break
      case 'pause':
        response = this.pauseSong()
        break
      case 'skip':
        if (this.queue.get(message.guild.id)) {
          response = await this.skipSong(message)
        } else {
          response = `Nenhuma música para ser pulada.`
        }
        break
      default:
        response = 'Comando não implementado'
        break
    }

    return response
  }

  async addToQueue(url, message) {
    const allSongs = this.queue.get(message.guild.id) ?? []
    if (!url.includes('youtube')) {
      allSongs.push({ url })
      this.queue.set(message.guild.id, allSongs)
      return
    }
    const info = await ytdl.getInfo(url)
    const musicDetails = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: parseInt(info.videoDetails.lengthSeconds),
      thumbnailUrl:
        info.videoDetails.thumbnails[0].url ??
        info.videoDetails.thumbnail.thumbnails[0].url
    }

    const song = {
      url,
      musicDetails
    }

    allSongs.push(song)
    console.log('allSongs:', allSongs)
    this.queue.set(message.guild.id, allSongs)
    return
  }

  async playNextSong(message) {
    console.log(
      `this.queue.get(${message.guild.id}) - playNextSong: `,
      this.queue.get(message.guild.id)
    )

    const queueSongs = this.queue.get(message.guild.id)
    const song = queueSongs ? queueSongs[0] : null
    console.log('song:', JSON.stringify(song))

    if (!song) {
      return 'Não há músicas na fila.'
    }

    let stream

    if (song.url.includes('spotify')) {
      // Handle Spotify URL
      // Implement code to convert Spotify URL to playable audio stream
      const spotifyStream = await this.convertSpotifyUrlToStream(song.url)
      stream = spotifyStream
    } else if (song.url.includes('soundcloud')) {
      // Handle SoundCloud URL
      // Implement code to convert SoundCloud URL to playable audio stream
      const soundcloudStream = await this.convertSoundCloudUrlToStream(song.url)
      stream = soundcloudStream
    } else {
      stream = ytdl(song.url, { filter: 'audioonly' })
    }
    const resource = createAudioResource(stream)
    this.player.play(resource)

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    })
    connection.subscribe(this.player)

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.queue.delete(message.guild.id)
      connection.destroy()
      this.playNextSong(message)
    })

    this.player.on('error', (error) => {
      console.error(`Error: ${error}`)
    })

    this.player.on(AudioPlayerStatus.Playing, () => {
      const embed = new EmbedBuilder()
        .setTitle('Música Iniciada')
        .addFields({ name: 'Título', value: song.musicDetails.title })
        .addFields({ name: 'Autor', value: song.musicDetails.author })
        .addFields({
          name: 'Duração',
          value: `${Math.floor(song.musicDetails.duration / 60)}:${
            song.musicDetails.duration % 60
          }`
        })
        .addFields({
          name: 'Músicas na fila',
          value: `${queueSongs.length ? queueSongs.length - 1 : 0}`
        })
        .setURL(song.url)
        .setImage(song.musicDetails.thumbnailUrl)
        .setColor('#00ff00')

      message.channel.send({ embeds: [embed] })
    })

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      connection.destroy()
    })
  }

  pauseSong() {
    this.player.pause()
    return 'Música pausada.'
  }

  stopSong() {
    this.player.stop()
    this.connection.destroy()
    return 'Música parada.'
  }
  unpauseSong() {
    this.player.unpause()
    return 'Música despausada.'
  }

  async skipSong(message) {
    this.queue.set(message.guild.id, this.queue.get(message.guild.id).slice(1))
    await this.playNextSong(message)
  }

  async convertSpotifyUrlToStream(url) {
    try {
      // Extract Spotify track ID
      const trackInfo = await spotifyUrlInfo.getData(url)
      const trackId = trackInfo.id

      // Get track's preview URL (30 seconds preview)
      const trackData = await spotifyApi.getTrack(trackId)
      const previewUrl = trackData.body.preview_url

      if (!previewUrl) {
        throw new Error('No preview URL available for this track.')
      }

      // Convert preview URL to stream
      return previewUrl
    } catch (error) {
      console.error('Error converting Spotify URL to stream:', error)
      throw error
    }
  }

  async convertSoundCloudUrlToStream(url) {
    try {
      const streamUrl = await soundCloud.download(url)
      return streamUrl
    } catch (error) {
      console.error('Error converting SoundCloud URL to stream:', error)
      throw error
    }
  }
}
