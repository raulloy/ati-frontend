import {
  detailPaginatedResults,
  getHuecos,
  getPerfiles,
  getPerfilesProduct,
  getProduct,
  getQuotation,
} from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaginationButton, parseRequestUrl } from '../utils.js';
const Parser = require('expr-eval').Parser;

const DetailScreen = {
  after_render: async () => {
    const request = parseRequestUrl();
    // console.log(request.page);
    const data = await detailPaginatedResults(request.page);
    const perfiles = await getPerfiles();

    const previous = data.previous;
    const next = data.next;
    const dataLength = data.length;

    // console.log(previous);
    // console.log(next);
    // console.log('limit:', data.limit);
    // console.log('pages:', Math.ceil(dataLength / data.limit));

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

    const buttons = document.getElementsByClassName('card');
    Array.from(buttons).forEach((button) => {
      button.addEventListener('click', async () => {
        const detailProduct = [await getProduct(button.id)];
        const idsCollection =
          button.parentNode.parentNode.getElementsByTagName('td');
        const idsArray = Array.from(
          idsCollection,
          (element) => element.innerHTML
        );
        const productInfo = await getProduct(button.id);
        const alto = parseInt(productInfo.Alto);
        const ancho = parseInt(productInfo.Ancho);
        const perfilesData = await getPerfilesProduct(idsArray[4]);
        const perfilesCalc = perfilesData.map((perfil) =>
          Parser.parse(perfil.Formula).evaluate({ H: alto, L: ancho })
        );
        const huecosData = await getHuecos(idsArray[4]);
        const HuecosCalcH = huecosData.map((hueco) =>
          Parser.parse(hueco.Formula_Alto).evaluate({ H: alto })
        );
        const HuecosCalcL = huecosData.map((hueco) =>
          Parser.parse(hueco.Formula_Ancho).evaluate({ L: ancho })
        );

        const doc = new jsPDF();

        const perfilesFilter = perfilesData.map((element) =>
          perfiles.filter(
            (perfil) => perfil.Codigo == Object.values(element)[1]
          )
        );
        // console.log(perfilesFilter[0]);

        const perfilesTransform = perfilesData.map((element, index) => [
          ['Img'],
          Object.values(element)[1],
          [perfilesFilter[index][0].Descripcion],
          Object.values(element)[2],
          perfilesCalc[index],
          ['||'],
          Object.values(element)[3],
        ]);
        // console.log(perfilesTransform);

        const HuecosTransform = huecosData.map((element, index) => [
          Object.values(element)[1],
          Object.values(element)[2],
          HuecosCalcH[index],
          HuecosCalcL[index],
          Object.values(element)[3],
          Object.values(element)[4],
        ]);
        console.log(huecosData);
        // console.log(HuecosTransform);

        const rowHeaders = detailProduct.map((product) => [
          Object.keys(product)[2],
          Object.keys(product)[3],
          Object.keys(product)[4],
          Object.keys(product)[7],
          Object.keys(product)[8],
        ]);
        const detailRows = detailProduct.map((product) => [
          Object.values(product)[2],
          Object.values(product)[3],
          Object.values(product)[4],
          Object.values(product)[7],
          Object.values(product)[8],
        ]);

        autoTable(doc, {
          head: [
            [
              {
                content: 'ATI',
                styles: {
                  halign: 'left',
                  fontSize: 18,
                  textColor: '#ffffff',
                },
              },
              {
                content: 'Hoja de Corte',
                styles: {
                  halign: 'right',
                  fontSize: 20,
                  textColor: '#ffffff',
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {
            fillColor: '#308ec4',
          },
        });
        autoTable(doc, {
          head: rowHeaders,
          body: detailRows,
        });
        autoTable(doc, {
          head: [
            [
              {
                content: 'Perfiles',
                styles: {
                  halign: 'left',
                  fontSize: 18,
                  textColor: '#ffffff',
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {
            fillColor: '#308ec4',
          },
        });
        autoTable(doc, {
          head: [
            [
              'Imagen',
              'Referencia',
              'Descripcion',
              'Cantidad',
              'Medida',
              'Tipo de Corte',
              'Formula',
            ],
          ],
          body: perfilesTransform,
        });
        autoTable(doc, {
          head: [
            [
              {
                content: 'Huecos',
                styles: {
                  halign: 'left',
                  fontSize: 18,
                  textColor: '#ffffff',
                },
              },
            ],
          ],
          theme: 'plain',
          styles: {
            fillColor: '#308ec4',
          },
        });
        autoTable(doc, {
          head: [
            [
              'Hueco',
              'Cantidad',
              'Medida Alto',
              'Medida Ancho',
              'Formula Alto',
              'Formula Ancho',
            ],
          ],
          body: HuecosTransform,
        });

        doc.save(button.id);
      });
    });
  },
  render: async () => {
    const request = parseRequestUrl();
    const data = await detailPaginatedResults(request.page);

    if (data.error) {
      return `<div>${data.error}</div>`;
    }

    const productsDetail = data.results;

    const quotationNumbers = await Promise.all(
      productsDetail.map(async (product) => {
        const quotationID = product.ID_Cotizacion;
        const quotationData = await getQuotation(quotationID);
        const quotationNumber = quotationData.No_Cotizacion;
        return [quotationID, quotationNumber];
      })
    );

    const returnQuotationNumber = (id) => {
      const qNumber = quotationNumbers.filter((element) => element[0] == id);
      return qNumber[0][1];
    };

    return `
    <h1>Detalle</h1>
    
    <table>
      <tr>
        <th>ID</th>
        <th>ID Cotizacion</th>
        <th>Ubicacion</th>
        <th>Tipo</th>
        <th>Codigo</th>
        <th>Unidad</th>
        <th>Alto</th>
        <th>Ancho</th>
        <th>Referencia</th>
        <th>Importe</th>
        <th>Hoja de corte</th>
      </tr>
      ${productsDetail
        .map(
          (product) => `
          <tr>
            <td><a href="/#/detail/${product.ID}">${product.ID}</a></td>
            <td>${returnQuotationNumber(product.ID_Cotizacion)}</td>
            <td>${product.Ubicacion}</td>
            <td>${product.Tipo}</td>
            <td>${product.Codigo}</td>
            <td>${product.Unidad}</td>
            <td>${product.Alto}</td>
            <td>${product.Ancho}</td>
            <td>${product.Referencia}</td>
            <td>${product.Importe}</td>
            <td><button id="${
              product.ID
            }" class="card">Hoja de corte</button></td>
          </tr>
        `
        )
        .join('')}
    </table>
      
    <div class="pagination-buttons" id="pagination-buttons"></div>

    `;
  },
};
export default DetailScreen;
