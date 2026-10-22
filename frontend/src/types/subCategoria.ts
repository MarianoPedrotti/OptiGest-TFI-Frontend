export interface SubCategoria {

    id: number;

    categoriaId: number;

    nombre: string;

    nombreCategoria?: string;

}


export interface SubCategoriaCreateDto {

    categoriaId: number;

    nombre: string;

}


export interface SubCategoriaUpdateDto {

    id: number;

    categoriaId: number;

    nombre: string;

}
