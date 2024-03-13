export class DiscordUserAdminEntity {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    // public password: string,
    public isActive: boolean,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}
