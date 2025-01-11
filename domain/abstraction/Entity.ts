export default abstract class Entity<TId> {
  public createdDate: Date;

  constructor(
    public id: TId,
    createdDate?: Date,
    public updatedDate?: Date,
  ) {
    this.createdDate = createdDate ?? new Date();
  }
}
