import { handler } from './generate-wallpaper';

(async () => {
  handler(null)
    .catch(console.log);
})();