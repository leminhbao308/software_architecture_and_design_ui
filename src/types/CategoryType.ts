export interface CategoryType {
    id: string,
    name: string,
    children: CategoryType[],
    metadata: object
}
