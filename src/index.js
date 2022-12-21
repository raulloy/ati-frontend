import DetailScreen from './screens/DetailScreen.js';
import Error404Screen from './screens/Error404Screen.js';
import HomeScreen from './screens/HomeScreen.js';
import ProductsScreen from './screens/Products.Screen.js';
import { parseRequestUrl } from './utils.js';

const routes = {
  '/': HomeScreen,
  '/products': ProductsScreen,
  '/detail': DetailScreen,
};

const router = async () => {
  const request = parseRequestUrl();
  const parseRequest =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '');
  const screen = routes[parseRequest] ? routes[parseRequest] : Error404Screen;

  const main = document.getElementById('main-container');
  main.innerHTML = await screen.render();
  screen.after_render ? await screen.after_render() : '';
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
