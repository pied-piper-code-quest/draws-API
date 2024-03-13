export class DiscordUserEntity {
  constructor(
    public id: string,
    public discordId: string,
    public username: string,
    public avatar: string,
    public discriminator: string,
    public globalName: string,
    public email: string,
    public verified: boolean,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
