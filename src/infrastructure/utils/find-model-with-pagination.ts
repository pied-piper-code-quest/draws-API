import { FilterQuery, Model, model } from "mongoose";
import { ResponseWithPagination } from "../../domain/interfaces";

interface Options<T> {
  model: Model<T>;
  filter?: FilterQuery<T>;
  limit: number;
  page: number;
}
export async function FindModelWithPagination<T>({
  model,
  filter = {},
  limit,
  page,
}: Options<T>): Promise<ResponseWithPagination<T>> {
  const offset = (+page - 1) * limit;
  const totalDocuments = await model.countDocuments({
    isActive: true,
  });
  const documents = await model.find(filter).limit(limit).skip(offset);
  const totalPages = Math.ceil(totalDocuments / limit);
  return {
    data: documents,
    totalPages: totalPages,
    currentPage: +page,
  };
}
