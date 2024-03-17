import { Validators } from "../../../config";
import type { DtoResponse } from "../../interfaces";

export class UpdateDrawDto {
  private constructor(
    public title: string,
    public description: string,
    public maxParticipants: number | null,
    public numberOfWinners: number,
    public prizes: string[],
    public maxDateToJoin: string | null,
  ) {}

  static create(props: Record<string, any>): DtoResponse<UpdateDrawDto> {
    const {
      title,
      description,
      maxParticipants,
      numberOfWinners,
      prizes,
      maxDateToJoin,
    } = props;
    const errors: string[] = [];

    if (!title) errors.push("title es requerido");
    if (!description) errors.push("description es requerido");

    if (maxParticipants && maxParticipants < 1)
      errors.push("maxParticipants debe ser null o un entero positivo");
    if (!Validators.isNumber(numberOfWinners))
      errors.push("numberOfWinners debe ser un número");

    if (!prizes) errors.push("prizes es requerido");
    if (prizes.length === 0)
      errors.push("Se debe asignar al menos 1 premio - prizes");

    if (numberOfWinners !== prizes.length)
      errors.push(
        "La cantidad de premios debe ser igual al número de ganadores - prizes | numberOfWinners",
      );
    if (maxDateToJoin && !Validators.isDate(maxDateToJoin))
      errors.push("Fecha máxima para unirse inválida - maxDateToJoin");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new UpdateDrawDto(
        title,
        description,
        maxParticipants || null,
        numberOfWinners,
        prizes,
        maxDateToJoin,
      ),
    ];
  }
}
