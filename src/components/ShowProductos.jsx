import React, { useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { alertaSuccess, alertaError, alertaWarning } from '../funciones';

const ShowProductos = () => {
    const [products, setProducts] = useState([])
    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [titleModal, setTitleModal] = useState('')
    const [operation, setOperation] = useState(1)

    /**
     * Obtiene listado de productos desde el local storage
     */
    const getProductos = () => {
        const localStorageProductos = localStorage.getItem('PRODUCTOS')
        const parsedProductos = localStorageProductos ? JSON.parse(localStorageProductos) : []

        if (!Array.isArray(parsedProductos)) {
            setProducts([])
        } else {
            setProducts(parsedProductos)
        }
    }

    /**
     * Carga los registros de productos
     */
    useEffect(() => {
        getProductos();
    }, [])


    /**
     * Abre el modal con los atributos del producto, si se va a editar, se cargan los datos
     * @param {Number} operation - 1. Agregar, 2. Editar 
     * @param {Number} id - Identificador del producto
     * @param {String} title - Nombre del producto
     * @param {String} description - Descripción del producto 
     * @param {Number} price - Precio del producto
     */
    const openModal = (operation, id, title, description, price) => {
        setId('');
        setTitle('');
        setDescription('');
        setPrice('');

        if (operation === 1) {
            setTitleModal('Registrar Producto');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Producto');
            setOperation(2);
            setId(id);
            setTitle(title);
            setDescription(description);
            setPrice(price);
        }
    };

    /**
     * Permite el uso de localStorage dependiendo el tipo de operación
     * @param {string} metodo - Tipo de método a utilizar: POST, PUT, DELETE
     * @param {JSON} parametros - Objeto JSON que se enviará a localStorage
     */
    const enviarSolicitud = (metodo, parametros = {}) => {
        const saveUpdateProducto = [...products]
        let mensaje

        if (metodo === 'POST') {
            saveUpdateProducto.push({ ...parametros, id: Date.now() })
            mensaje = 'Se guardó el producto'
        } else if (metodo === 'PUT') {
            const productoIndex = saveUpdateProducto.findIndex(producto => producto.id === parametros.id)

            if (productoIndex !== -1) {
                saveUpdateProducto[productoIndex] = { ...parametros }
                mensaje = 'Se editó el producto'
            }
        } else if (metodo === 'DELETE') {
            const productos = saveUpdateProducto.filter(producto => producto.id !== parametros.id)
            setProducts(productos)
            localStorage.setItem('PRODUCTOS', JSON.stringify(productos))
            alertaSuccess('Se eliminó el producto')
            return
        }

        localStorage.setItem('PRODUCTOS', JSON.stringify(saveUpdateProducto))
        setProducts(saveUpdateProducto)
        alertaSuccess(mensaje)
        document.getElementById('btnCerrarModal').click()

    }

     /**
     * Valida que cada uno de los campos del formulario no vayan vacíos
     */
     const validar = () => {
        let payload;
        let metodo;

        if (title === '') {
            alertaWarning('Nombre del producto en blanco', 'title');
        } else if (description === '') {
            alertaWarning('Descripción del producto en blanco', 'description');
        } else if (price === '') {
            alertaWarning('Precio del producto en blanco', 'price');
        } else {
            payload = {
                id: id || Date.now(),
                title: title,
                description: description,
                price: parseFloat(price)
            };

            if (operation === 1) {
                metodo = 'POST';
            } else {
                metodo = 'PUT';
            }

            enviarSolicitud(metodo, payload);
        }
    };

    /**
     * Proceso para eliminar un producto
     * @param {Number} id - Identificador del producto a eliminar 
     */
    const deleteProducto = (id) => {
        const MySwal = withReactContent(Swal);

        MySwal.fire({
            title: '¿Está seguro de eliminar el producto?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarSolicitud('DELETE', { id });
            }
        }).catch((error) => {
            alertaError(error);
        });
    };

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalProductos">
                                <i className="fa-solid fa-circle-plus" /> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12 col-lg-8 offset-lg-2">
                    <div className="table-responsive">
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Producto</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {
                                    products.map((product, i) => (
                                        <tr key={product.id}>
                                            <td>{i + 1}</td>
                                            <td>{product.title}</td>
                                            <td>{product.description}</td>
                                            <td>{product.price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}</td>
                                            <td>
                                                <button onClick={() => openModal(2, product.id, product.title, product.description, product.price)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProductos'>
                                                    <i className='fa-solid fa-edit' />
                                                </button>
                                                <button onClick={() => deleteProducto(product.id)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id='modalProductos' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{titleModal}</label>
                            <button className='btn-close' data-bs-dismiss='modal' aria-label='close' />
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' />
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift' /></span>
                                <input type='text' id='title' className='form-control' placeholder='Nombre' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment' /></span>
                                <input type='text' id='description' className='form-control' placeholder='Descripción' value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign' /></span>
                                <input type='text' id='price' className='form-control' placeholder='Precio' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk' /> Guardar
                            </button>
                            <button id='btnCerrarModal' className='btn btn-danger' data-bs-dismiss='modal'> Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowProductos;