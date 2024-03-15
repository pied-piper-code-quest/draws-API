import { Validators } from "../../../config";
import type { DtoResponse } from "../../interfaces";

export class CreateDrawDto {
  private constructor(
    public title: string,
    public description: string,
    public createdBy: string,
    public maxParticipants: number | null,
    public numberOfWinners: number,
    public alternativeWinners: number,
    public prizes: string[],
    public resultDate: string | null,
    public maxDateToJoin: string | null,
    public manual: boolean,
  ) {}

  static create(props: Record<string, any>): DtoResponse<CreateDrawDto> {
    const {
      title,
      description,
      createdBy,
      maxParticipants,
      numberOfWinners,
      alternativeWinners,
      prizes,
      resultDate,
      maxDateToJoin,
      manual,
    } = props;
    const errors: string[] = [];

    if (!title) errors.push("title es requerido");
    if (!description) errors.push("description es requerido");
    if (!createdBy) errors.push("createdBy id es requerido");
    if (maxParticipants && maxParticipants < 1)
      errors.push("maxParticipants debe ser null o un entero positivo");
    if (!numberOfWinners) errors.push("numberOfWinners es requerido");
    if (!Validators.isNumber(numberOfWinners))
      errors.push("numberOfWinners debe ser un número");
    if (!prizes) errors.push("prizes es requerido");
    if (prizes.length === 0)
      errors.push("Se debe asignar al menos 1 premio - prizes");
    if (numberOfWinners !== prizes.length)
      errors.push(
        "La cantidad de premios debe ser igual al número de ganadores - prizes | numberOfWinners",
      );
    if (alternativeWinners && alternativeWinners < 0)
      errors.push("alternativeWinners debe ser mayor o igual a 0");
    if (resultDate && !Validators.isDate(resultDate))
      errors.push("Fecha de resultado inválida - resultDate");
    if (maxDateToJoin && !Validators.isDate(maxDateToJoin))
      errors.push("Fecha máxima para unirse inválida - maxDateToJoin");
    if (!Validators.isBoolean(manual)) errors.push("manual es requerido");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new CreateDrawDto(
        title,
        description,
        createdBy,
        maxParticipants || null,
        numberOfWinners,
        alternativeWinners || 0,
        prizes,
        resultDate,
        maxDateToJoin,
        manual,
      ),
    ];
  }
}
