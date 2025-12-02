export interface IBaseMapper<TEntity,TDocument>{
    toMongo(Entity:TEntity):TDocument,
    fromMongo(doc:TDocument):TEntity  
}