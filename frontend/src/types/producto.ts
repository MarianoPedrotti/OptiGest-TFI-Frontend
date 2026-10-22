

export interface Producto {

    id:number;

    nombre:string;

    descripcion:string;

    sku:string;

    precioCompra:number;

    precioVenta:number;

    stock:number;
    categoriaId: number;


    subCategoriaId:number;

    marcaProductoId:number;

    nombreMarcaProducto:string;

    nombreSubCategoria:string;

    modelo:string;

}
export interface ProductoCreateDto{

    nombre:string;

    descripcion:string;

    sku:string;

    precioCompra:number;

    precioVenta:number;

    stock:number;
    categoriaId: number;


    subCategoriaId:number;

    marcaProductoId:number;

    modelo:string;

}
export interface ProductoUpdateDto{

    id:number;

    nombre:string;

    descripcion:string;

    sku:string;

    precioCompra:number;

    precioVenta:number;

    stock:number;
    categoriaId: number;

    subCategoriaId:number;

    marcaProductoId:number;

    modelo:string;

}
export interface ProductoResumen {
    totalProductos: number;
    valorStockVenta: number;
    bajoStock: number;
    sinStock: number;
}