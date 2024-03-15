import type { Request, Response } from "express";
import { DrawsRepositoryInterface } from "../../domain/repositories";
import { ResponseError } from "../custom-errors";
import {
  CreateDrawDto,
  FindWithPaginationDto,
  FinishDrawDtoDto,
  UpdateDrawDto,
} from "../../domain/dtos";

export class DrawsController {
  private handleError = ResponseError;

  constructor(private readonly drawsRepository: DrawsRepositoryInterface) {}

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
    const [error, finishDrawDtoDto] = FinishDrawDtoDto.create(req.params);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const draw = await this.drawsRepository.finishDraw(id, finishDrawDtoDto);
      res.status(200).json(draw);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  subscribeToDraw = async (req: Request, res: Response) => {
    const { id } = req.params;
    // @ts-ignore
    const discordUserId = req.discordUser!._id;

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
