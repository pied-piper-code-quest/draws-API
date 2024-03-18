import type { Request, Response } from "express";
import { Server as WSServer } from "socket.io";
import type { DiscordOAuthProvider } from "../../config/oauth";
import { DrawsRepositoryInterface } from "../../domain/repositories";
import {
  CreateDrawDto,
  FindWithPaginationDto,
  GenerateWinnerDto,
  UpdateDrawDto,
} from "../../domain/dtos";
import { ResponseError } from "../custom-errors";
import { CustomError } from "../../domain/errors";
import { WEBSOCKETS_MESSAGES } from "../../domain/constants";

export class DrawsController {
  private handleError = ResponseError;

  constructor(
    private readonly webSockets: WSServer,
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
      this.webSockets.emit(WEBSOCKETS_MESSAGES.REFRESH_DRAWS_LIST);
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
      this.webSockets.emit(WEBSOCKETS_MESSAGES.REFRESH_DRAWS_LIST);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  startDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const draw = await this.drawsRepository.startDraw(id);
      this.webSockets.emit(WEBSOCKETS_MESSAGES.REFRESH_DRAWS_LIST);
      this.webSockets.emit(WEBSOCKETS_MESSAGES.START_DRAW, draw.id);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  cancelDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const draw = await this.drawsRepository.cancelDraw(id);
      this.webSockets.emit(WEBSOCKETS_MESSAGES.REFRESH_DRAWS_LIST);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  generateWinner = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, generateWinnerDto] = GenerateWinnerDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    this.webSockets.emit(WEBSOCKETS_MESSAGES.WAITING_WINNER, {
      drawId: id,
      position: generateWinnerDto.winnerPosition,
    });
    try {
      const draw = await this.drawsRepository.generateWinner(
        id,
        generateWinnerDto,
      );
      this.webSockets.emit(WEBSOCKETS_MESSAGES.REFRESH_DRAWS_LIST);
      setTimeout(() => {
        this.webSockets.emit(WEBSOCKETS_MESSAGES.NEW_WINNER, draw.id);
      }, 6000);
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

    try {
      const draw = await this.drawsRepository.subscribeToDraw(
        id,
        discordUserId,
      );
      this.webSockets.emit(WEBSOCKETS_MESSAGES.REFRESH_DRAWS_LIST);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
