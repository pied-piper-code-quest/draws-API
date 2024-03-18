export class DiscordUserEntity {
  constructor(
    public id: string,
    public discordId: string,
    public username: string,
    public avatar: string | null,
    public email: string | null,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
