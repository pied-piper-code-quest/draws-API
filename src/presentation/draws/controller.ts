import type { Request, Response } from "express";
import type { DiscordOAuthProvider } from "../../config/oauth";
import { DrawsRepositoryInterface } from "../../domain/repositories";
import {
  CreateDrawDto,
  FindWithPaginationDto,
  FinishDrawDtoDto,
  UpdateDrawDto,
} from "../../domain/dtos";
import { ResponseError } from "../custom-errors";
import { CustomError } from "../../domain/errors";

export class DrawsController {
  private handleError = ResponseError;

  constructor(
    private readonly drawsRepository: DrawsRepositoryInterface,
    private readonly OAuth: DiscordOAuthProvider,
  ) {}

  getDraws = async (req: Request, res: Response) => {
    const [error, findWithPaginationDto] = FindWithPaginationDto.create(
      req.query,
    );
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const drawsResponse = await this.drawsRepository.find(
        findWithPaginationDto,
      );
      res.status(200).json(drawsResponse);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  getDrawById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const draw = await this.drawsRepository.findOne(id);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  createNewDraw = async (req: Request, res: Response) => {
    // @ts-ignore
    const userAdminId = req.userAdmin!._id;
    const [error, createDrawDto] = CreateDrawDto.create({
      ...req.body,
      createdBy: userAdminId,
    });
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const draw = await this.drawsRepository.createDraw(createDrawDto);
      res.status(201).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  updateDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateDrawDto] = UpdateDrawDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const draw = await this.drawsRepository.updateDraw(id, updateDrawDto);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  cancelDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const draw = await this.drawsRepository.cancelDraw(id);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  finishDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, finishDrawDtoDto] = FinishDrawDtoDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const draw = await this.drawsRepository.finishDraw(id, finishDrawDtoDto);
      // TODO: Enviar el evento de websockets para mostrar el resultado
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  subscribeToDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    // @ts-ignore
    const discordUserId = req.discordUser!._id;
    // @ts-ignore
    const discordUserAccessToken = req.discordUser!.access_token;

    const checkGuildMemberResponse = await this.OAuth.checkIfUserExistInServer(
      discordUserAccessToken,
    );
    if (checkGuildMemberResponse.status === 401) {
      throw CustomError.internalServer("El usuario no tiene access_token");
    }
    if (checkGuildMemberResponse.status !== 200) {
      throw CustomError.unauthorized(
        "El usuario no está en el servidor de discord de DevTalles.",
      );
    }
    // const data = await checkGuildMemberResponse.json();
    // console.log(data);
    // const joinedAt = data.joined_at;
    try {
      const draw = await this.drawsRepository.subscribeToDraw(
        id,
        discordUserId,
      );
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
