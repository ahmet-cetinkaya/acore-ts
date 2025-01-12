import Entity from "./Entity";

export default abstract class SoftDeletableEntity<TId> extends Entity<TId> {
  constructor(
    id: TId,
    createdDate?: Date,
    updatedDate?: Date,
    public deletedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
