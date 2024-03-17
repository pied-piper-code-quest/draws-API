import { Validators } from "../../../config";
import type { DtoResponse } from "../../interfaces";

export class GenerateWinnerDto {
  private constructor(
    public winnerPosition: number,
    public manualWinner: boolean,
    public winnerId: string,
  ) {}

  static create(props: Record<string, any>): DtoResponse<GenerateWinnerDto> {
    const { winnerPosition, manualWinner, winnerId } = props;
    const errors: string[] = [];
    if (!Validators.isNumber(winnerPosition))
      errors.push("winnerPosition es requerido");
    if (!Validators.isBoolean(manualWinner))
      errors.push("manualWinner es requerido");
    if (manualWinner && !winnerId)
      errors.push("Si el resultado es manual debe proporcionar un id ganador");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new GenerateWinnerDto(winnerPosition, manualWinner, winnerId),
    ];
  }
}
