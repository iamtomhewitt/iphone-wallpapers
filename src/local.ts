import { handler } from './generate-wallpaper';

(async () => {
  handler(null)
    .then(console.log);
})();