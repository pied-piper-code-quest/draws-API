import type { Request, Response } from "express";
import { UsersRepositoryInterface } from "../../domain/repositories";
import { ResponseError } from "../custom-errors";
import { FindWithPaginationDto, RegisterUserAdminDto } from "../../domain/dtos";

export class UsersController {
  private handleError = ResponseError;

  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  executeUserSeed = async (_req: Request, res: Response) => {
    try {
      const userAdmin = await this.usersRepository.seedUserAdmins();
      res.status(201).json(userAdmin);
    } catch (error) {
      res.status(405).json({ message: "METHOD NOT ALLOWED" });
    }
  };
  registerUserAdmin = async (req: Request, res: Response) => {
    const [error, registerUserAdminDto] = RegisterUserAdminDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const user =
        await this.usersRepository.registerUserAdmin(registerUserAdminDto);

      res.status(201).json({ user });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getUserAdmins = async (req: Request, res: Response) => {
    const [error, findWithPaginationDto] = FindWithPaginationDto.create(
      req.query,
    );
    if (error !== null) return res.status(400).json({ message: error });
    try {
      const userAdmins = await this.usersRepository.findUserAdmins(
        findWithPaginationDto,
      );
      res.status(200).json(userAdmins);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  getUserAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const userAdmin = await this.usersRepository.findOneUserAdmin(id);
      res.status(200).json(userAdmin);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  deleteUserAdminById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const userAdmin = await this.usersRepository.deleteUserAdmin(id);
      res.status(200).json(userAdmin);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getDiscordUsers = async (req: Request, res: Response) => {
    const [error, findWithPaginationDto] = FindWithPaginationDto.create(
      req.query,
    );
    if (error !== null) return res.status(400).json({ message: error });
    try {
      const discordUsers = await this.usersRepository.findDiscordUsers(
        findWithPaginationDto,
      );
      res.status(200).json(discordUsers);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  getDiscordUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const discordUser = await this.usersRepository.findOneDiscordUser(id);
      res.status(200).json(discordUser);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
