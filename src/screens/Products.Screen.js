import { productsPaginatedResults } from '../api';
import { PaginationButton, parseRequestUrl } from '../utils';

const ProductsScreen = {
  after_render: async () => {
    const request = parseRequestUrl();
    console.log(request.page);
    const data = await productsPaginatedResults(request.page);

    const previous = data.previous;
    const next = data.next;
    const dataLength = data.length;

    console.log(previous);
    console.log(next);
    console.log('limit:', data.limit);
    console.log('pages:', Math.ceil(dataLength / data.limit));

    const paginationButtons = new PaginationButton(
      Math.ceil(dataLength / data.limit),
      10,
      parseInt(request.page)
    );

    paginationButtons.render();

    paginationButtons.onChange((e) => {
      console.log('-- changed', e.target.value);
      document.location.hash = `/${request.resource}?page=${e.target.value}&limit=20`;
    });
  },
  render: async () => {
    const request = parseRequestUrl();
    const data = await productsPaginatedResults(request.page);

    if (data.error) {
      return `<div>${data.error}</div>`;
    }

    const products = data.results;

    return `
    <h1>Productos</h1>

    <table>
      <tr>
        <th>Codigo</th>
        <th>Descripcion</th>
        <th>Serie</th>
      </tr>
      ${products
        .map(
          (product) => `
          <tr>
        <td>${product.Codigo}</td>
        <td>${product.Descripcion}</td>
        <td>${product.Serie}</td>
        </tr>
        `
        )
        .join('')}
    </table>
      
    <div class="pagination-buttons" id="pagination-buttons">
    </div>

    `;
  },
};
export default ProductsScreen;
