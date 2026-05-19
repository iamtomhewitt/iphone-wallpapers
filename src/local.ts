import { handler } from './lambda/generate-wallpaper';

(async () => {
  handler(null)
    .catch(console.log);
})();